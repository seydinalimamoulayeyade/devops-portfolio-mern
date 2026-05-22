pipeline {
    agent any

    options {
        timestamps()
    }

    triggers {
        githubPush()
    }

    environment {
        DOCKERHUB_USER = 'lims4'
        FRONTEND_IMAGE = "${DOCKERHUB_USER}/devops-portfolio-mern-frontend"
        BACKEND_IMAGE = "${DOCKERHUB_USER}/devops-portfolio-mern-backend"
        VITE_API_URL = 'http://localhost:5000/api'
        COMPOSE_ENV = '.env.ci'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    def shortCommit = sh(
                        script: 'git rev-parse --short HEAD',
                        returnStdout: true
                    ).trim()

                    env.IMAGE_TAG = "v${new Date().format('yyyy.MM.dd')}-${shortCommit}"
                    echo "Image tag: ${env.IMAGE_TAG}"
                }
            }
        }

        stage('Build and test') {
            steps {
                withCredentials([string(
                    credentialsId: 'jwt-secret',
                    variable: 'JWT_SECRET_VALUE'
                )]) {
                    sh '''
                        set -eu

                        cat > "$COMPOSE_ENV" <<EOF
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

                        chmod 600 "$COMPOSE_ENV"

                        docker --version
                        docker compose version

                        docker compose --env-file "$COMPOSE_ENV" down --remove-orphans -v || true
                        docker rm -f ci-frontend ci-backend ci-mongo 2>/dev/null || true

                        if ! docker compose --env-file "$COMPOSE_ENV" up --build --wait --wait-timeout 180 --force-recreate --remove-orphans; then
                            docker compose --env-file "$COMPOSE_ENV" logs
                            exit 1
                        fi

                        docker compose --env-file "$COMPOSE_ENV" ps
                    '''
                }
            }
        }

        stage('Push images') {
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
    }

    post {
        always {
            sh '''
                if command -v docker >/dev/null 2>&1; then
                    docker logout || true

                    if [ -f "$COMPOSE_ENV" ]; then
                        docker compose --env-file "$COMPOSE_ENV" down --remove-orphans -v || true
                    fi
                fi

                rm -f "$COMPOSE_ENV"
            '''
        }
        success {
            echo "Pipeline reussi - images publiees avec le tag ${env.IMAGE_TAG}"
        }
        failure {
            echo 'Pipeline echoue - consultez les logs Jenkins.'
        }
    }
}
