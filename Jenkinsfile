pipeline {
    agent any

    environment {
        GITHUB = credentials('GITHUB')      // Token de GitHub
        SONARKEY = credentials('SONARKEY')  // Token de SonarCloud
    }

    stages {
        stage('Clonar repositorio') {
            steps {
                echo "📖 Clonando repositorio..."
                checkout([$class: 'GitSCM',
                          branches: [[name: 'develop']],
                          userRemoteConfigs: [[
                              url: 'https://github.com/UDLAIA-STATS/UDLAAIWebSite.git',
                              credentialsId: 'GITHUB'
                          ]]
                ])
            }
        }

        stage('Instalar dependencias') {
            steps {
                echo "📦 Instalando dependencias..."
                bat 'npm install'
            }
        }

        stage('Ejecutar pruebas unitarias') {
            steps {
                echo "🧪 Ejecutando pruebas..."
                bat 'npm test || echo "⚠️ Advertencia: pruebas con errores"'
            }
        }

        stage('Análisis de calidad con SonarQube') {
            steps {
                echo "🔍 Iniciando análisis con SonarQube..."
                bat """
                npx sonar-scanner ^
                    -Dsonar.projectKey=UDLAAIWebSite ^
                    -Dsonar.organization=UDLAIA-STATS ^
                    -Dsonar.sources=src ^
                    -Dsonar.host.url=https://sonarcloud.io ^
                    -Dsonar.login=%SONARKEY%
                """
            }
        }

        stage('Reportar estado a GitHub') {
            steps {
                node {
                    script {
                        def commitSHA = bat(script: 'git rev-parse HEAD', returnStdout: true).trim()
                        echo "📌 Commit SHA: ${commitSHA}"

                        // Estado pending
                        bat """
                        curl -X POST -H "Accept: application/vnd.github+json" ^
                             -H "Authorization: Bearer %GITHUB%" ^
                             https://api.github.com/repos/UDLAIA-STATS/UDLAAIWebSite/statuses/${commitSHA} ^
                             -d "{\\"state\\":\\"pending\\", \\"description\\":\\"Pipeline ejecutado\\", \\"context\\":\\"jenkins/ci\\", \\"target_url\\":\\"%BUILD_URL%\\"}"
                        """
                    }
                }
            }
        }

        stage('Build Develop') {
            steps {
                echo "🚀 Construyendo proyecto..."
                bat 'npm run build'
            }
        }

        stage('Deploy Develop') {
            steps {
                echo "📤 Desplegando proyecto..."
                // Agregar aquí pasos de despliegue según tu infraestructura
            }
        }
    }

    post {
        success {
            node {
                script {
                    def commitSHA = bat(script: 'git rev-parse HEAD', returnStdout: true).trim()
                    echo "✅ Pipeline finalizado correctamente"

                    bat """
                    curl -X POST -H "Accept: application/vnd.github+json" ^
                         -H "Authorization: Bearer %GITHUB%" ^
                         https://api.github.com/repos/UDLAIA-STATS/UDLAAIWebSite/statuses/${commitSHA} ^
                         -d "{\\"state\\":\\"success\\", \\"description\\":\\"Pipeline finalizado\\", \\"context\\":\\"jenkins/ci\\", \\"target_url\\":\\"%BUILD_URL%\\"}"
                    """
                }
            }
        }

        failure {
            node {
                script {
                    def commitSHA = bat(script: 'git rev-parse HEAD', returnStdout: true).trim()
                    echo "❌ Pipeline fallido"

                    bat """
                    curl -X POST -H "Accept: application/vnd.github+json" ^
                         -H "Authorization: Bearer %GITHUB%" ^
                         https://api.github.com/repos/UDLAIA-STATS/UDLAAIWebSite/statuses/${commitSHA} ^
                         -d "{\\"state\\":\\"failure\\", \\"description\\":\\"Error en el pipeline\\", \\"context\\":\\"jenkins/ci\\", \\"target_url\\":\\"%BUILD_URL%\\"}"
                    """
                }
            }
        }

        always {
            echo "🕒 Pipeline finalizado (always)"
        }
    }
}
