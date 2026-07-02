pipeline {
    agent any

    options {
        timestamps()
    }

    triggers {
        githubPush()  // Déclenchement instantané via webhook GitHub
    }

    environment {
        DOCKERHUB_USER    = 'lims4'
        FRONTEND_IMAGE    = "${DOCKERHUB_USER}/devops-portfolio-mern-frontend"
        BACKEND_IMAGE     = "${DOCKERHUB_USER}/devops-portfolio-mern-backend"
        SONAR_PROJECT_KEY = 'devops-portfolio-mern'
        K8S_NAMESPACE     = 'devops-portfolio-dev'  // Namespace géré par Terraform
        TRIVY_IMAGE       = 'aquasec/trivy:0.58.1'  // Scanner de sécurité (étape 07)
    }

    stages {
        // ── 1. CHECKOUT ─────────────────────────────────────────────
        stage('Checkout') {
            steps {
                // Resilience reseau : on relance jusqu'a 3 fois en cas de
                // coupure passagere, avec un timeout de clone de 20 min.
                retry(3) {
                    checkout([
                        $class: 'GitSCM',
                        branches: scm.branches,
                        userRemoteConfigs: scm.userRemoteConfigs,
                        extensions: scm.extensions + [[
                            $class: 'CloneOption',
                            timeout: 20
                        ]]
                    ])
                }
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

        // ── 3. TRIVY — REPO & IAC (shift-left) ───────────────────────
        // Scanne le code source AVANT de builder : vulnérabilités de
        // dépendances, secrets en clair, mauvaises configs IaC (Dockerfile,
        // Terraform, K8s). Un secret détecté bloque le pipeline.
        stage('Trivy — Repo & IaC') {
            steps {
                // NB (Docker-in-Docker) : le workspace Jenkins vit dans le volume
                // jenkins_home. Un bind mount "$PWD:/project" serait résolu par le
                // daemon HÔTE (chemin inexistant → dossier vide). On partage donc les
                // volumes de Jenkins via --volumes-from et on opère sur $WORKSPACE.
                sh '''
                    set -eu
                    mkdir -p "$WORKSPACE/trivy-reports"

                    # (a) Filesystem : vuln + secret + misconfig + license → rapport SARIF
                    docker run --rm \
                        --volumes-from jenkins \
                        -v trivy-cache:/root/.cache/ \
                        -w "$WORKSPACE" \
                        "$TRIVY_IMAGE" fs --scanners vuln,secret,misconfig,license \
                        --severity HIGH,CRITICAL --ignore-unfixed --no-progress \
                        --format sarif --output "$WORKSPACE/trivy-reports/repo.sarif" .

                    # (b) IaC : misconfigurations (Dockerfile, Terraform, Kubernetes) — rapport
                    docker run --rm \
                        --volumes-from jenkins \
                        -v trivy-cache:/root/.cache/ \
                        -w "$WORKSPACE" \
                        "$TRIVY_IMAGE" config --severity HIGH,CRITICAL .

                    # (c) Gate SECRETS : toute fuite de secret bloque le build
                    docker run --rm \
                        --volumes-from jenkins \
                        -v trivy-cache:/root/.cache/ \
                        -w "$WORKSPACE" \
                        "$TRIVY_IMAGE" fs --scanners secret --exit-code 1 --no-progress .
                '''
            }
            post {
                always {
                    archiveArtifacts artifacts: 'trivy-reports/*', allowEmptyArchive: true
                }
            }
        }

        // ── 4. SONARQUBE ANALYSIS ─────────────────────────────────────
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    script {
                        def scannerHome = tool 'SonarScanner'
                        // La configuration (sources, exclusions, coverage...) est
                        // centralisee dans sonar-project.properties a la racine.
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }

        // ── 5. QUALITY GATE ──────────────────────────────────────────
        // Bloque le pipeline si la qualité est insuffisante
        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        // ── 6. BUILD IMAGES ───────────────────────────────────────────
        // Construit les images backend & frontend (sans push : on scanne d'abord).
        stage('Build Images') {
            steps {
                sh '''
                    set -eu

                    # Backend
                    docker build \
                        -t "${BACKEND_IMAGE}:latest" \
                        -t "${BACKEND_IMAGE}:${IMAGE_TAG}" \
                        ./backend

                    # Frontend (URL d'API injectée au build)
                    docker build \
                        --build-arg VITE_API_URL=/api \
                        -t "${FRONTEND_IMAGE}:latest" \
                        -t "${FRONTEND_IMAGE}:${IMAGE_TAG}" \
                        ./frontend
                '''
            }
        }

        // ── 7. TRIVY — IMAGE SCAN (gate qualité sécurité) ─────────────
        // Scanne les images construites (vuln + secret). Une vulnérabilité
        // CRITICAL corrigeable bloque le pipeline AVANT toute publication.
        stage('Trivy — Image Scan') {
            steps {
                sh '''
                    set -eu
                    mkdir -p "$WORKSPACE/trivy-reports"

                    for pair in "backend:${BACKEND_IMAGE}" "frontend:${FRONTEND_IMAGE}"; do
                        name="${pair%%:*}"
                        image="${pair#*:}:latest"
                        echo "──> Scan de l'image ${name} (${image})"

                        # Rapport HTML lisible (template intégré) — non bloquant
                        # --volumes-from jenkins : accès au workspace ET au docker.sock de Jenkins
                        docker run --rm \
                            --volumes-from jenkins \
                            -v trivy-cache:/root/.cache/ \
                            -w "$WORKSPACE" \
                            "$TRIVY_IMAGE" image --scanners vuln,secret \
                            --severity HIGH,CRITICAL --ignore-unfixed --no-progress \
                            --format template --template "@/contrib/html.tpl" \
                            --output "$WORKSPACE/trivy-reports/image-${name}.html" "${image}"

                        # Gate : CRITICAL corrigeable => échec du build
                        docker run --rm \
                            --volumes-from jenkins \
                            -v trivy-cache:/root/.cache/ \
                            "$TRIVY_IMAGE" image --scanners vuln \
                            --severity CRITICAL --ignore-unfixed --exit-code 1 \
                            --no-progress "${image}"
                    done
                '''
            }
            post {
                always {
                    archiveArtifacts artifacts: 'trivy-reports/*', allowEmptyArchive: true
                }
            }
        }

        // ── 8. PUSH IMAGES ────────────────────────────────────────────
        // Publie les images sur Docker Hub — uniquement si les scans ont réussi.
        stage('Push Images') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    sh '''
                        set -eu

                        echo "${DOCKER_PASS}" | docker login -u "${DOCKER_USER}" --password-stdin

                        docker push "${BACKEND_IMAGE}:latest"
                        docker push "${BACKEND_IMAGE}:${IMAGE_TAG}"
                        docker push "${FRONTEND_IMAGE}:latest"
                        docker push "${FRONTEND_IMAGE}:${IMAGE_TAG}"
                    '''
                }
            }
        }

        // ── 9. TERRAFORM VALIDATION ───────────────────────────────────
        // Valide la syntaxe Terraform (init + validate) et controle le formatage.
        // Pas de "terraform plan" ici : ce stage ne touche pas l'etat.
        stage('Terraform Validation') {
            steps {
                // init + validate : bloquants (vraie validation de syntaxe)
                sh '''
                    set -eu

                    echo "Validation de l'infrastructure Terraform"

                    cd terraform/environments/dev

                    # Initialisation (idempotent)
                    terraform init -input=false

                    # Validation de la syntaxe
                    terraform validate

                    echo "Validation Terraform reussie"
                '''

                // Formatage : non conforme => build UNSTABLE (visible), sans bloquer le deploiement
                catchError(buildResult: 'UNSTABLE', stageResult: 'UNSTABLE',
                           message: 'Formatage Terraform non conforme (lancez: terraform fmt -recursive)') {
                    sh '''
                        set -eu
                        cd terraform/environments/dev
                        terraform fmt -check -recursive
                    '''
                }
            }
        }

        // ── 10. DEPLOY TO KUBERNETES ──────────────────────────────────
        // Redémarre les déploiements pour récupérer les nouvelles images
        // L'infrastructure K8s est gérée par Terraform, pas par ce pipeline
        stage('Deploy to Kubernetes') {
            steps {
                sh """
                    set -eu

                    echo "Deploiement sur Kubernetes — namespace: \${K8S_NAMESPACE}"

                    # Pre-check : les deploiements doivent exister (crees par Terraform)
                    for dep in backend-deployment frontend-deployment; do
                        if ! kubectl get deployment/\$dep -n \${K8S_NAMESPACE} >/dev/null 2>&1; then
                            echo "ERREUR: deploiement '\$dep' introuvable dans \${K8S_NAMESPACE}."
                            echo "Lancez d'abord 'terraform apply' pour creer l'infrastructure K8s."
                            exit 1
                        fi
                    done

                    # Redémarre les déploiements pour récupérer la nouvelle image :latest
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
            subject: "[Jenkins] ${env.JOB_NAME} #${env.BUILD_NUMBER} — SUCCESS",
            body: """
    Pipeline terminé avec succès.

    Projet   : ${env.JOB_NAME}
    Build    : #${env.BUILD_NUMBER}
    Tag      : ${env.IMAGE_TAG}
    Durée    : ${currentBuild.durationString}
    Lien     : ${env.BUILD_URL}

    Stages exécutés :
    Checkout
     Backend Tests
     Trivy — Repo & IaC
     SonarQube Analysis
     Quality Gate
     Build Images
     Trivy — Image Scan
     Push Images
     Terraform Validation
     Deploy to Kubernetes
                """.stripIndent()
            )
        }
            failure {
                echo 'Pipeline echoue — consultez les logs Jenkins.'
                mail(
                to: 'seydinalimamoulayeyade@gmail.com',
                subject: "[Jenkins] ${env.JOB_NAME} #${env.BUILD_NUMBER} — FAILURE",
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
                subject: "[Jenkins] ${env.JOB_NAME} #${env.BUILD_NUMBER} — UNSTABLE",
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
