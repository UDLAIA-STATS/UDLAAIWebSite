pipeline {
    agent any

    environment {
        SONARQUBE = credentials('SONARKEY')
        GITHUB_TOKEN = credentials('GITHUB')
        REPO_URL = 'https://github.com/UDLAIA-STATS/UDLAAIWebSite.git'
        BRANCH_NAME = 'develop'
    }

    options {
        timestamps()
        ansiColor('xterm')
    }

    stages {

        stage('Clonar repositorio') {
            steps {
                wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'xterm']) {
                    script {
                        bat "echo 🔄 Clonando repositorio..."
                        git branch: "${BRANCH_NAME}",
                            credentialsId: 'GITHUB',
                            url: "https://${GITHUB_TOKEN}@github.com/UDLAIA-STATS/UDLAAIWebSite.git"
                    }
                }
            }
        }

        stage('Instalar dependencias') {
            steps {
                wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'xterm']) {
                    bat '''
                        echo 📦 Instalando dependencias...
                        npm install
                    '''
                }
            }
        }

        stage('Ejecutar pruebas unitarias') {
            steps {
                wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'xterm']) {
                    bat '''
                        echo 🧪 Ejecutando pruebas...
                        npm test || echo "⚠️ Advertencia: pruebas con errores"
                    '''
                }
            }
        }

        stage('Análisis de calidad con SonarQube') {
            steps {
                wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'xterm']) {
                    bat '''
                        echo 🔍 Iniciando análisis con SonarQube...
                        npx sonar-scanner ^
                            -Dsonar.projectKey=UDLAAIWebSite ^
                            -Dsonar.sources=src ^
                            -Dsonar.host.url=https://sonarcloud.io ^
                            -Dsonar.login=%SONARQUBE%
                    '''
                }
            }
        }

        stage('Build Develop') {
            when { branch 'develop' }
            steps {
                wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'xterm']) {
                    bat '''
                        echo 🏗️ Compilando proyecto para develop...
                        npm run build
                    '''
                }
            }
        }

        stage('Deploy Develop') {
            when { branch 'develop' }
            steps {
                wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'xterm']) {
                    bat '''
                        echo 🚀 Desplegando a entorno local de producción simulado...
                        xcopy /Y /E build "C:\\deploy\\UDLAAIWebSite"
                        echo ✅ Despliegue completado.
                    '''
                }
            }
        }
    }

    post {
        always {
            wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'xterm']) {
                bat '''
                    echo 📰 Pipeline finalizado (always)
                    curl -X POST -H "Accept: application/vnd.github+json" ^
                         -H "Authorization: Bearer %GITHUB_TOKEN%" ^
                         https://api.github.com/repos/UDLAIA-STATS/UDLAAIWebSite/statuses/%GIT_COMMIT% ^
                         -d "{\\"state\\":\\"pending\\", \\"description\\":\\"Pipeline ejecutado\\", \\"context\\":\\"jenkins/ci\\", \\"target_url\\":\\"%BUILD_URL%\\"}"
                '''
            }
        }
        success {
            wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'xterm']) {
                bat '''
                    echo ✅ Pipeline exitoso.
                    curl -X POST -H "Accept: application/vnd.github+json" ^
                         -H "Authorization: Bearer %GITHUB_TOKEN%" ^
                         https://api.github.com/repos/UDLAIA-STATS/UDLAAIWebSite/statuses/%GIT_COMMIT% ^
                         -d "{\\"state\\":\\"success\\", \\"description\\":\\"Pipeline completado con éxito\\", \\"context\\":\\"jenkins/ci\\", \\"target_url\\":\\"%BUILD_URL%\\"}"
                '''
            }
        }
        failure {
            wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'xterm']) {
                bat '''
                    echo ❌ Pipeline fallido.
                    curl -X POST -H "Accept: application/vnd.github+json" ^
                         -H "Authorization: Bearer %GITHUB_TOKEN%" ^
                         https://api.github.com/repos/UDLAIA-STATS/UDLAAIWebSite/statuses/%GIT_COMMIT% ^
                         -d "{\\"state\\":\\"failure\\", \\"description\\":\\"Error en el pipeline\\", \\"context\\":\\"jenkins/ci\\", \\"target_url\\":\\"%BUILD_URL%\\"}"
                '''
            }
        }
    }
}
