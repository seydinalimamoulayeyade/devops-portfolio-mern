# ── Configuration ─────────────────────────────────────────────────────────────
NGROK_DOMAIN="nuclei-mosaic-ecard.ngrok-free.app"
JENKINS_PORT=8080
K8S_NAMESPACE="devops-portfolio"
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

# ── Couleurs ──────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

log_info()    { echo -e "${CYAN}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[OK]${NC}   $1"; }
log_warn()    { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error()   { echo -e "${RED}[ERR]${NC}  $1"; }

echo ""
echo -e "${CYAN}╔════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     DevOps Portfolio — Start Script    ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════╝${NC}"
echo ""

# ── 1. Docker Desktop ─────────────────────────────────────────────────────────
log_info "Vérification de Docker..."
if ! docker info > /dev/null 2>&1; then
  log_error "Docker Desktop n'est pas lancé. Démarre-le manuellement puis relance ce script."
  exit 1
fi
log_success "Docker Desktop actif"

# ── 2. Jenkins ────────────────────────────────────────────────────────────────
log_info "Démarrage de Jenkins..."
JENKINS_STATUS=$(docker inspect jenkins --format='{{.State.Status}}' 2>/dev/null || echo "absent")

if [ "$JENKINS_STATUS" = "running" ]; then
  log_success "Jenkins déjà en cours d'exécution"
elif [ "$JENKINS_STATUS" = "exited" ] || [ "$JENKINS_STATUS" = "created" ]; then
  docker start jenkins > /dev/null
  log_success "Jenkins démarré"
else
  log_error "Conteneur Jenkins introuvable. Vérifie ton installation."
  exit 1
fi

# ── 3. SonarQube ──────────────────────────────────────────────────────────────
log_info "Démarrage de SonarQube..."
cd "$PROJECT_DIR"

if docker compose -f docker-compose.sonar.yml ps --services --filter "status=running" 2>/dev/null | grep -q sonarqube; then
  log_success "SonarQube déjà en cours d'exécution"
else
  docker compose -f docker-compose.sonar.yml up -d > /dev/null 2>&1
  log_success "SonarQube démarré (attendre ~90s pour qu'il soit prêt)"
fi

# ── 4. Kubernetes ─────────────────────────────────────────────────────────────
log_info "Vérification du cluster Kubernetes..."

if ! kubectl cluster-info > /dev/null 2>&1; then
  log_warn "Cluster Kubernetes non disponible — vérifie Docker Desktop > Kubernetes"
else
  log_success "Cluster Kubernetes actif"

  # ── 4a. Reconfigurer kubectl dans Jenkins ──────────────────────────────────
  log_info "Mise à jour du kubeconfig Jenkins..."

  # Récupérer le port actuel de l'API K8s
  K8S_PORT=$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}' 2>/dev/null | grep -o '[0-9]*$')

  if [ -n "$K8S_PORT" ]; then
    # Copier le kubeconfig dans Jenkins
    cat /c/Users/HP/.kube/config | docker exec -i -u root jenkins bash -c "mkdir -p /root/.kube && cat > /root/.kube/config && chmod 600 /root/.kube/config" 2>/dev/null

    # Remplacer 127.0.0.1 par host.docker.internal
    docker exec -u root jenkins bash -c "sed -i 's|https://127.0.0.1:${K8S_PORT}|https://host.docker.internal:${K8S_PORT}|g' /root/.kube/config" 2>/dev/null

    # Désactiver TLS
    docker exec -u root jenkins bash -c "kubectl config set-cluster docker-desktop --insecure-skip-tls-verify=true" > /dev/null 2>&1

    log_success "kubeconfig Jenkins mis à jour (port: $K8S_PORT)"
  else
    log_warn "Impossible de récupérer le port K8s"
  fi

  # ── 4b. Vérifier et déployer les pods si nécessaire ────────────────────────
  log_info "Vérification des pods K8s..."

  PODS_RUNNING=$(kubectl get pods -n "$K8S_NAMESPACE" --field-selector=status.phase=Running 2>/dev/null | grep -c "Running" || echo "0")

  if [ "$PODS_RUNNING" -ge 3 ]; then
    log_success "Pods K8s opérationnels ($PODS_RUNNING/3 Running)"
  else
    log_warn "Pods K8s absents ou incomplets ($PODS_RUNNING/3) — redéploiement en cours..."

    # Appliquer tous les manifests
    kubectl apply -f k8s/namespace.yaml > /dev/null 2>&1
    kubectl apply -f k8s/secret.yaml > /dev/null 2>&1
    kubectl apply -f k8s/configmap.yaml > /dev/null 2>&1
    kubectl apply -f k8s/jenkins-rbac.yaml > /dev/null 2>&1
    kubectl apply -f k8s/mongo/ > /dev/null 2>&1
    kubectl apply -f k8s/backend/ > /dev/null 2>&1
    kubectl apply -f k8s/frontend/ > /dev/null 2>&1

    log_success "Manifests K8s appliqués — les pods démarrent (attendre ~60s)"

    # Attendre que les pods soient Running
    log_info "Attente des pods..."
    for i in $(seq 1 12); do
      sleep 5
      PODS_RUNNING=$(kubectl get pods -n "$K8S_NAMESPACE" --field-selector=status.phase=Running 2>/dev/null | grep -c "Running" || echo "0")
      if [ "$PODS_RUNNING" -ge 3 ]; then
        log_success "Pods démarrés ($PODS_RUNNING/3 Running)"
        break
      fi
      echo -e "  ${YELLOW}...${NC} $PODS_RUNNING/3 pods Running (${i}/12)"
      if [ "$i" -eq 12 ]; then
        log_warn "Timeout — vérifie manuellement: kubectl get pods -n $K8S_NAMESPACE"
      fi
    done
  fi
fi

# ── 5. ngrok ──────────────────────────────────────────────────────────────────
log_info "Démarrage de ngrok..."

if curl -s http://localhost:4040/api/tunnels > /dev/null 2>&1; then
  CURRENT_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"[^"]*"' | head -1 | cut -d'"' -f4)
  log_success "ngrok déjà actif — URL: $CURRENT_URL"
else
  nohup ngrok http --domain="$NGROK_DOMAIN" "$JENKINS_PORT" > /tmp/ngrok.log 2>&1 &

  log_info "Attente de ngrok..."
  for i in $(seq 1 10); do
    sleep 1
    if curl -s http://localhost:4040/api/tunnels > /dev/null 2>&1; then
      log_success "ngrok actif — URL: https://$NGROK_DOMAIN"
      break
    fi
    if [ "$i" -eq 10 ]; then
      log_warn "ngrok n'a pas démarré — vérifie /tmp/ngrok.log"
    fi
  done
fi

# ── Résumé ────────────────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}╔════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║           Environnement prêt           ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${GREEN}Jenkins${NC}    → http://localhost:$JENKINS_PORT"
echo -e "  ${GREEN}SonarQube${NC}  → http://localhost:9000"
echo -e "  ${GREEN}ngrok${NC}      → https://$NGROK_DOMAIN"
echo -e "  ${GREEN}K8s${NC}        → kubectl get pods -n $K8S_NAMESPACE"
echo ""
echo -e "  ${YELLOW}Frontend K8s${NC} → kubectl port-forward service/frontend-service 3000:80 -n $K8S_NAMESPACE"
echo ""
