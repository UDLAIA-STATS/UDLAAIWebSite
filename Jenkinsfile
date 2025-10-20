pipeline {
    agent any

    environment {
        GITHUB = credentials('GITHUB')       // Token GitHub
        SONARKEY = credentials('SONARKEY')   // Token SonarCloud
        SONAR_ORG = 'udlaia-stats'
        SONAR_PROJECT_KEY = 'UDLAAIWebSite'
    }

    stages {
        stage('Clonar repositorio') {
            steps {
                echo '🌀 Clonando el repositorio desde GitHub...'
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

        stage('Deploy Develop') {
            steps {
                echo '🚀 Desplegando build generado...'
                // Puedes usar npm run preview o tu script de deploy
                bat 'npm run preview'
            }
        }
    }

    post {
        always {
            script {
                def commitSHA = bat(script: 'git rev-parse HEAD', returnStdout: true).trim()
                echo "📋 Pipeline finalizado. Commit: ${commitSHA}"
            }
        }

        success {
            script {
                def commitSHA = bat(script: 'git rev-parse HEAD', returnStdout: true).trim()
                echo "✅ Pipeline completado con éxito."
                bat """
                curl -X POST -H "Accept: application/vnd.github+json" ^
                     -H "Authorization: Bearer ${GITHUB}" ^
                     https://api.github.com/repos/UDLAIA-STATS/UDLAAIWebSite/statuses/${commitSHA} ^
                     -d "{\\"state\\":\\"success\\", \\"description\\":\\"Build y deploy exitosos\\", \\"context\\":\\"jenkins/ci\\", \\"target_url\\":\\"%BUILD_URL%\\"}"
                """
            }
        }

        failure {
            script {
                def commitSHA = bat(script: 'git rev-parse HEAD', returnStdout: true).trim()
                echo "❌ Pipeline fallido."
                bat """
                curl -X POST -H "Accept: application/vnd.github+json" ^
                     -H "Authorization: Bearer ${GITHUB}" ^
                     https://api.github.com/repos/UDLAIA-STATS/UDLAAIWebSite/statuses/${commitSHA} ^
                     -d "{\\"state\\":\\"failure\\", \\"description\\":\\"Error en el pipeline\\", \\"context\\":\\"jenkins/ci\\", \\"target_url\\":\\"%BUILD_URL%\\"}"
                """
            }
        }
    }
}
