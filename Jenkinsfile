pipeline {
    agent any

    options {
        timestamps()
    }

    triggers {
        githubPush()
    }

    environment {
        DOCKERHUB_USER    = 'lims4'
        FRONTEND_IMAGE    = "${DOCKERHUB_USER}/devops-portfolio-mern-frontend"
        BACKEND_IMAGE     = "${DOCKERHUB_USER}/devops-portfolio-mern-backend"
        SONAR_PROJECT_KEY = 'devops-portfolio-mern'
        K8S_NAMESPACE     = 'devops-portfolio'
    }

    stages {
        // ── 1. CHECKOUT ─────────────────────────────────────────────
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

        // ── 2. BACKEND TESTS ─────────────────────────────────────────
        // Jest + coverage LCOV transmis à SonarQube
        stage('Backend Tests') {
            tools {
                nodejs 'NodeJS'
            }
            steps {
                sh '''
                    set -eu
                    cd backend
                    npm ci
                    npm run test:ci
                '''
            }
            post {
                always {
                    junit allowEmptyResults: true,
                          testResults: 'backend/coverage/junit.xml'
                }
            }
        }

        // ── 3. SONARQUBE ANALYSIS ─────────────────────────────────────
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    script {
                        def scannerHome = tool 'SonarScanner'
                        sh """
                            set -eu
                            ${scannerHome}/bin/sonar-scanner \
                                -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                                -Dsonar.sources=backend/src,backend/server.js,frontend/src \
                                -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/coverage/**,**/uploads/** \
                                -Dsonar.sourceEncoding=UTF-8 \
                                -Dsonar.javascript.lcov.reportPaths=backend/coverage/lcov.info \
                                -Dsonar.test.inclusions=backend/src/__tests__/**
                        """
                    }
                }
            }
        }

        // ── 4. QUALITY GATE ──────────────────────────────────────────
        // Bloque le pipeline si la qualité est insuffisante
        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        // ── 5. BUILD & PUSH ───────────────────────────────────────────
        // Construction et push des images Docker en une seule étape
        // Remplace l'ancien "Build and test" + "Push images" séparés
        stage('Build & Push') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    ),
                    string(
                        credentialsId: 'jwt-secret',
                        variable: 'JWT_SECRET_VALUE'
                    )
                ]) {
                    sh """
                        set -eu

                        echo "\${DOCKER_PASS}" | docker login -u "\${DOCKER_USER}" --password-stdin

                        # Build backend
                        docker build \
                            -t "\${BACKEND_IMAGE}:latest" \
                            -t "\${BACKEND_IMAGE}:\${IMAGE_TAG}" \
                            ./backend

                        # Build frontend avec l'URL d'API injectée au build
                        docker build \
                            --build-arg VITE_API_URL=/api \
                            -t "\${FRONTEND_IMAGE}:latest" \
                            -t "\${FRONTEND_IMAGE}:\${IMAGE_TAG}" \
                            ./frontend

                        # Push toutes les images
                        docker push "\${BACKEND_IMAGE}:latest"
                        docker push "\${BACKEND_IMAGE}:\${IMAGE_TAG}"
                        docker push "\${FRONTEND_IMAGE}:latest"
                        docker push "\${FRONTEND_IMAGE}:\${IMAGE_TAG}"
                    """
                }
            }
        }

        // ── 6. DEPLOY TO KUBERNETES ───────────────────────────────────
        // Applique les manifests et redémarre les Pods
        // K8s pull la nouvelle image :latest grâce à imagePullPolicy: Always
        stage('Deploy to Kubernetes') {
            steps {
                sh """
                    set -eu

                    echo "Deploiement sur Kubernetes — namespace: \${K8S_NAMESPACE}"

                    # Le namespace est géré manuellement — pas dans le pipeline
                    # kubectl apply -f k8s/namespace.yaml

                    # Applique les manifests (idempotent)
                    kubectl apply -f k8s/secret.yaml -n \${K8S_NAMESPACE}
                    kubectl apply -f k8s/configmap.yaml -n \${K8S_NAMESPACE}
                    kubectl apply -f k8s/mongo/ -n \${K8S_NAMESPACE}
                    kubectl apply -f k8s/backend/ -n \${K8S_NAMESPACE}
                    kubectl apply -f k8s/frontend/ -n \${K8S_NAMESPACE}

                    # Redémarre backend et frontend pour récupérer la nouvelle image
                    kubectl rollout restart deployment/backend-deployment -n \${K8S_NAMESPACE}
                    kubectl rollout restart deployment/frontend-deployment -n \${K8S_NAMESPACE}

                    # Attend la fin du rollout (timeout 2 min)
                    kubectl rollout status deployment/backend-deployment -n \${K8S_NAMESPACE} --timeout=120s
                    kubectl rollout status deployment/frontend-deployment -n \${K8S_NAMESPACE} --timeout=120s

                    echo "Deploiement termine — pods en cours:"
                    kubectl get pods -n \${K8S_NAMESPACE}
                """
            }
        }
    }

    post {
        always {
            sh 'docker logout || true'
        }
        success {
            echo "Pipeline reussi — tag: ${env.IMAGE_TAG} deploye sur K8s"
            mail(
            to: 'seydinalimamoulayeyade@gmail.com',
            subject: "✅ [Jenkins] ${env.JOB_NAME} #${env.BUILD_NUMBER} — SUCCESS",
            body: """
    Pipeline terminé avec succès.

    Projet   : ${env.JOB_NAME}
    Build    : #${env.BUILD_NUMBER}
    Tag      : ${env.IMAGE_TAG}
    Durée    : ${currentBuild.durationString}
    Lien     : ${env.BUILD_URL}

    Stages exécutés :
    ✅ Checkout
    ✅ Backend Tests
    ✅ SonarQube Analysis
    ✅ Quality Gate
    ✅ Build & Push
    ✅ Deploy to Kubernetes
                """.stripIndent()
            )
            }
            failure {
                echo 'Pipeline echoue — consultez les logs Jenkins.'
                mail(
                to: 'seydinalimamoulayeyade@gmail.com',
                subject: "❌ [Jenkins] ${env.JOB_NAME} #${env.BUILD_NUMBER} — FAILURE",
                body: """
    Pipeline échoué — intervention requise.

    Projet   : ${env.JOB_NAME}
    Build    : #${env.BUILD_NUMBER}
    Durée    : ${currentBuild.durationString}
    Lien     : ${env.BUILD_URL}

    Consultez les logs pour identifier le stage en erreur.
                """.stripIndent()
            )
            }
            unstable {
                mail(
                to: 'seydinalimamoulayeyade@gmail.com',
                subject: "⚠️ [Jenkins] ${env.JOB_NAME} #${env.BUILD_NUMBER} — UNSTABLE",
                body: """
    Pipeline instable — certains tests ont échoué.

    Projet   : ${env.JOB_NAME}
    Build    : #${env.BUILD_NUMBER}
    Durée    : ${currentBuild.durationString}
    Lien     : ${env.BUILD_URL}
                """.stripIndent()
            )
        }
    }
}
