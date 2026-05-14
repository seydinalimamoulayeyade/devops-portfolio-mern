pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
        timestamps()
    }

    triggers {
        githubPush()
    }

    environment {
        DOCKERHUB_USER = 'lims4'
        FRONTEND_IMAGE = "${DOCKERHUB_USER}/devops-portfolio-mern-frontend"
        BACKEND_IMAGE  = "${DOCKERHUB_USER}/devops-portfolio-mern-backend"
        VITE_API_URL   = 'http://localhost:5000/api'
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Clonage du depot : ${env.GIT_BRANCH ?: 'branche Jenkins'}"
                checkout scm
                script {
                    def shortCommit = sh(
                        script: 'git rev-parse --short HEAD',
                        returnStdout: true
                    ).trim()

                    env.IMAGE_TAG = "v${new Date().format('yyyy.MM.dd')}-${shortCommit}"
                    echo "Tag Docker calcule : ${env.IMAGE_TAG}"
                }
            }
        }

        stage('Preflight') {
            steps {
                echo "Verification de Docker sur l'agent Jenkins..."
                sh '''
                    set -eu

                    if ! command -v docker >/dev/null 2>&1; then
                        echo "ERREUR: Docker CLI est introuvable sur cet agent Jenkins."
                        echo "Installez Docker CLI dans Jenkins et donnez acces au daemon Docker."
                        exit 127
                    fi

                    docker --version
                    docker compose version
                '''
            }
        }

        stage('Prepare CI env') {
            steps {
                echo 'Preparation du fichier .env pour Docker Compose...'
                withCredentials([string(
                    credentialsId: 'jwt-secret',
                    variable: 'JWT_SECRET_VALUE'
                )]) {
                    sh '''
                        set -eu

                        cat > .env <<EOF
COMPOSE_PROJECT_NAME=devops-portfolio-mern-ci
JWT_SECRET=$JWT_SECRET_VALUE
VITE_API_URL=$VITE_API_URL
MONGO_CONTAINER_NAME=ci-mongo
BACKEND_CONTAINER_NAME=ci-backend
FRONTEND_CONTAINER_NAME=ci-frontend
MONGO_PORT=27018
BACKEND_PORT=5001
FRONTEND_PORT=8081
EOF

                        chmod 600 .env
                    '''
                }
            }
        }

        stage('Build') {
            steps {
                echo 'Build des images Docker...'
                sh 'docker compose build'
            }
        }

        stage('Test') {
            steps {
                echo 'Demarrage et verification des healthchecks...'
                sh '''
                    set -eu

                    docker compose --env-file .env down --remove-orphans -v || true
                    docker rm -f ci-frontend ci-backend ci-mongo 2>/dev/null || true

                    docker compose --env-file .env up -d --force-recreate --remove-orphans

                    for service in mongo backend frontend; do
                        echo "Attente du service $service..."
                        container_id="$(docker compose ps -q "$service")"

                        if [ -z "$container_id" ]; then
                            echo "ERREUR: conteneur introuvable pour $service"
                            docker compose ps
                            exit 1
                        fi

                        for attempt in $(seq 1 30); do
                            status="$(docker inspect --format='{{if .State.Health}}{{.State.Health.Status}}{{else}}no-healthcheck{{end}}' "$container_id")"
                            echo "$service: $status"

                            if [ "$status" = "healthy" ] || [ "$status" = "no-healthcheck" ]; then
                                break
                            fi

                            if [ "$attempt" -eq 30 ]; then
                                echo "ERREUR: $service n'est pas healthy apres attente."
                                docker compose logs "$service"
                                exit 1
                            fi

                            sleep 5
                        done
                    done

                    docker compose ps
                '''
            }
        }

        stage('Push') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        set -eu

                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

                        docker tag "$FRONTEND_IMAGE:latest" "$FRONTEND_IMAGE:$IMAGE_TAG"
                        docker tag "$BACKEND_IMAGE:latest" "$BACKEND_IMAGE:$IMAGE_TAG"

                        docker push "$FRONTEND_IMAGE:latest"
                        docker push "$BACKEND_IMAGE:latest"
                        docker push "$FRONTEND_IMAGE:$IMAGE_TAG"
                        docker push "$BACKEND_IMAGE:$IMAGE_TAG"
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploiement en local...'
                withCredentials([string(
                    credentialsId: 'jwt-secret',
                    variable: 'JWT_SECRET_VALUE'
                )]) {
                    sh '''
                        set -eu

                        docker compose --env-file .env down || true

                        cat > .env.deploy <<EOF
JWT_SECRET=$JWT_SECRET_VALUE
VITE_API_URL=http://localhost:5000/api
EOF

                        docker rm -f frontend backend mongo 2>/dev/null || true
                        docker compose --env-file .env.deploy -p devops-portfolio-mern up -d
                        docker compose --env-file .env.deploy -p devops-portfolio-mern ps
                    '''
                }
            }
        }
    }

    post {
        always {
            sh '''
                if command -v docker >/dev/null 2>&1; then
                    docker logout || true
                else
                    echo "Docker indisponible: logout ignore."
                fi
            '''
            script {
                try {
                    emailext(
                        to: 'seydinalimamoulayeyade@gmail.com',
                        subject: "[Jenkins] ${currentBuild.currentResult} - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                        body: """
                            <h2>Resultat : ${currentBuild.currentResult}</h2>
                            <table>
                                <tr><td><b>Job</b></td><td>${env.JOB_NAME}</td></tr>
                                <tr><td><b>Build</b></td><td>#${env.BUILD_NUMBER}</td></tr>
                                <tr><td><b>Branche</b></td><td>${env.GIT_BRANCH ?: 'N/A'}</td></tr>
                                <tr><td><b>Tag image</b></td><td>${env.IMAGE_TAG ?: 'N/A'}</td></tr>
                                <tr><td><b>Duree</b></td><td>${currentBuild.durationString}</td></tr>
                                <tr><td><b>Logs</b></td><td><a href="${env.BUILD_URL}">${env.BUILD_URL}</a></td></tr>
                            </table>
                        """,
                        mimeType: 'text/html',
                        attachLog: false
                    )
                } catch (err) {
                    echo "Notification email ignoree: ${err.message}"
                }
            }
        }
        success {
            echo "Pipeline reussi - image publiee : ${env.IMAGE_TAG}"
        }
        failure {
            echo 'Pipeline echoue - nettoyage en cours...'
            sh '''
                if command -v docker >/dev/null 2>&1; then
                    docker compose --env-file .env down --remove-orphans -v || true
                    docker rm -f ci-frontend ci-backend ci-mongo 2>/dev/null || true
                else
                    echo "Docker indisponible: nettoyage ignore."
                fi
            '''
        }
    }
}
