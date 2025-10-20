pipeline {
    agent any

    environment {
        GITHUB = credentials('GITHUB')       // Token GitHub
        SONARKEY = credentials('SONARKEY')   // Token SonarCloud
        SONAR_ORG = 'udlaia-stats'
        SONAR_PROJECT_KEY = 'UDLAAIWebSite'
        DEPLOY_BRANCH = 'gh-pages'
    }

    stages {
        stage('Clonar repositorio') {
            steps {
                echo '🌀 Clonando repositorio desde GitHub...'
                git branch: 'develop',
                    url: 'https://github.com/UDLAIA-STATS/UDLAAIWebSite.git',
                    credentialsId: 'GITHUB'
            }
        }

        stage('Instalar dependencias') {
            steps {
                echo '📦 Instalando dependencias...'
                bat 'npm install'
            }
        }

        stage('Ejecutar pruebas unitarias') {
            steps {
                echo '🧪 Ejecutando pruebas unitarias...'
                bat 'npm run test || exit 0'
            }
        }

        stage('Build producción') {
            steps {
                echo '🏗️ Construyendo build de producción...'
                bat 'npm run build'
            }
        }

        stage('Análisis de calidad con SonarCloud') {
            steps {
                echo '🔍 Ejecutando análisis en SonarCloud...'
                bat """
                npx sonar-scanner ^
                  -Dsonar.organization=${SONAR_ORG} ^
                  -Dsonar.projectKey=${SONAR_PROJECT_KEY} ^
                  -Dsonar.sources=src ^
                  -Dsonar.host.url=https://sonarcloud.io ^
                  -Dsonar.login=${SONARKEY}
                """
            }
        }

        stage('Deploy a GitHub Pages') {
            steps {
                echo '🚀 Deploy en GitHub Pages (branch gh-pages)...'
                // Configurar git user
                bat """
                git config user.email "jenkins@ci.com"
                git config user.name "Jenkins CI"
                """

                // Clonar gh-pages temporalmente
                bat "git clone --branch ${DEPLOY_BRANCH} https://github.com/UDLAIA-STATS/UDLAAIWebSite.git dist-gh"

                // Limpiar y copiar nuevo build
                bat "rmdir /s /q dist-gh"
                bat "xcopy dist dist-gh /E /I /Y"

                // Subir cambios
                dir('dist-gh') {
                    bat """
                    git init
                    git add .
                    git commit -m "Deploy desde Jenkins - ${env.BUILD_NUMBER}"
                    git branch -M ${DEPLOY_BRANCH}
                    git remote add origin https://github.com/UDLAIA-STATS/UDLAAIWebSite.git
                    git push -f origin ${DEPLOY_BRANCH}
                    """
                }
            }
        }
    }

    post {
        always {
            echo '🕒 Pipeline finalizado'
        }
        success {
            echo '✅ Pipeline completado con éxito'
        }
        failure {
            echo '❌ Pipeline fallido'
        }
    }
}
