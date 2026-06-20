#!/bin/bash
# start-devops.sh
# Démarre l'environnement DevOps local après un redémarrage machine.
# Usage : ./scripts/start-devops.sh   (depuis n'importe où)
#
# Aligné sur le workflow actuel : déploiement via Terraform (namespace devops-portfolio-dev).

set -u

# ── Chemins (robustes, indépendants du répertoire d'appel) ────────────────────
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TF_DIR="$REPO_ROOT/terraform/environments/dev"
KUBECONFIG_SRC="${KUBECONFIG:-$HOME/.kube/config}"

# ── Configuration ─────────────────────────────────────────────────────────────
K8S_NAMESPACE="devops-portfolio-dev"   # namespace géré par Terraform

# ── Couleurs ──────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; CYAN='\033[0;36m'; NC='\033[0m'
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
  log_error "Docker Desktop n'est pas lancé. Démarre-le puis relance ce script."
  exit 1
fi
log_success "Docker Desktop actif"

# ── 2. Jenkins ────────────────────────────────────────────────────────────────
log_info "Démarrage de Jenkins..."
JENKINS_STATUS=$(docker inspect jenkins --format='{{.State.Status}}' 2>/dev/null || echo "absent")
if [ "$JENKINS_STATUS" = "running" ]; then
  log_success "Jenkins déjà actif"
elif [ "$JENKINS_STATUS" = "exited" ] || [ "$JENKINS_STATUS" = "created" ]; then
  docker start jenkins > /dev/null && log_success "Jenkins démarré"
else
  log_warn "Conteneur Jenkins introuvable — étape ignorée."
fi

# ── 3. SonarQube ──────────────────────────────────────────────────────────────
log_info "Démarrage de SonarQube..."
if docker compose -f "$REPO_ROOT/docker-compose.sonar.yml" ps --services --filter "status=running" 2>/dev/null | grep -q sonarqube; then
  log_success "SonarQube déjà actif"
else
  docker compose -f "$REPO_ROOT/docker-compose.sonar.yml" up -d > /dev/null 2>&1
  log_success "SonarQube démarré (prêt après ~90s)"
fi

# ── 4. Kubernetes ─────────────────────────────────────────────────────────────
log_info "Vérification du cluster Kubernetes..."
if ! kubectl cluster-info > /dev/null 2>&1; then
  log_warn "Cluster Kubernetes indisponible — vérifie Docker Desktop > Kubernetes"
else
  log_success "Cluster Kubernetes actif"

  # ── 4a. Reconfigurer kubectl dans Jenkins (accès au cluster depuis le conteneur)
  if [ "$JENKINS_STATUS" != "absent" ] && [ -f "$KUBECONFIG_SRC" ]; then
    log_info "Mise à jour du kubeconfig Jenkins..."
    K8S_PORT=$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}' 2>/dev/null | grep -o '[0-9]*$')
    if [ -n "$K8S_PORT" ]; then
      cat "$KUBECONFIG_SRC" | docker exec -i -u root jenkins bash -c "mkdir -p /root/.kube && cat > /root/.kube/config && chmod 600 /root/.kube/config" 2>/dev/null
      docker exec -u root jenkins bash -c "sed -i 's|https://127.0.0.1:${K8S_PORT}|https://host.docker.internal:${K8S_PORT}|g' /root/.kube/config" 2>/dev/null
      docker exec -u root jenkins bash -c "kubectl config set-cluster docker-desktop --insecure-skip-tls-verify=true" > /dev/null 2>&1
      log_success "kubeconfig Jenkins mis à jour (port: $K8S_PORT)"
    else
      log_warn "Port du cluster K8s introuvable — kubeconfig Jenkins non mis à jour"
    fi
  fi

  # ── 4b. Déploiement de l'app via Terraform (source de vérité) ───────────────
  RUNNING=$(kubectl get pods -n "$K8S_NAMESPACE" --field-selector=status.phase=Running --no-headers 2>/dev/null | grep -c "Running")
  if [ "${RUNNING:-0}" -ge 3 ]; then
    log_success "Application opérationnelle ($RUNNING pods Running dans $K8S_NAMESPACE)"
  elif [ ! -f "$TF_DIR/terraform.tfvars" ]; then
    log_warn "terraform.tfvars absent dans $TF_DIR — déploiement Terraform ignoré."
    log_warn "Crée-le depuis terraform.tfvars.example puis relance, ou applique manuellement."
  else
    log_info "Déploiement de l'application via Terraform..."
    ( cd "$TF_DIR" && terraform init -input=false > /dev/null 2>&1 && terraform apply -auto-approve -input=false > /dev/null 2>&1 ) \
      && log_success "Terraform appliqué — les pods démarrent (~60s)" \
      || log_warn "Échec du terraform apply — lance-le manuellement dans $TF_DIR"
  fi

  # ── 4c. Compte admin dans la base Mongo du cluster ─────────────────────────
  # La base Mongo K8s est indépendante de celle de Docker Compose : elle doit
  # avoir son propre compte admin. Le script seedAdmin.js fait un "upsert"
  # (créé s'il manque, sinon met à jour) → idempotent, ré-exécutable sans risque.
  if kubectl get deployment/backend-deployment -n "$K8S_NAMESPACE" > /dev/null 2>&1; then
    log_info "Vérification du compte admin (seed dans la base du cluster)..."
    if kubectl rollout status deployment/backend-deployment -n "$K8S_NAMESPACE" --timeout=90s > /dev/null 2>&1; then
      if kubectl exec -n "$K8S_NAMESPACE" deployment/backend-deployment -- npm run seed:admin > /dev/null 2>&1; then
        log_success "Compte admin prêt (admin@test.com / #admin123)"
      else
        log_warn "Seed admin échoué — lance manuellement :"
        log_warn "  kubectl exec -n $K8S_NAMESPACE deployment/backend-deployment -- npm run seed:admin"
      fi
    else
      log_warn "Backend pas encore prêt — seed admin ignoré. À relancer plus tard :"
      log_warn "  kubectl exec -n $K8S_NAMESPACE deployment/backend-deployment -- npm run seed:admin"
    fi
  fi

  # ── 4d. Stack de monitoring (Prometheus, Alertmanager, Grafana, exporters) ──
  MON_RUNNING=$(kubectl get pods -n monitoring --field-selector=status.phase=Running --no-headers 2>/dev/null | grep -c "Running")
  if [ "${MON_RUNNING:-0}" -ge 5 ]; then
    log_success "Monitoring opérationnel ($MON_RUNNING pods dans 'monitoring')"
  else
    log_info "Déploiement de la stack monitoring..."
    # Secret SMTP d'Alertmanager : hors Git (créé une seule fois). On avertit s'il manque.
    if ! kubectl get secret alertmanager-smtp -n monitoring > /dev/null 2>&1; then
      log_warn "Secret 'alertmanager-smtp' absent → Alertmanager ne pourra pas envoyer d'email."
      log_warn "À créer une fois : kubectl create secret generic alertmanager-smtp -n monitoring --from-literal=smtp-password=<MDP_APP_GMAIL>"
    fi
    kubectl apply -f "$REPO_ROOT/monitoring/prometheus/"          > /dev/null 2>&1
    kubectl apply -f "$REPO_ROOT/monitoring/node-exporter/"       > /dev/null 2>&1
    kubectl apply -f "$REPO_ROOT/monitoring/kube-state-metrics/"  > /dev/null 2>&1
    kubectl apply -f "$REPO_ROOT/monitoring/alertmanager/"        > /dev/null 2>&1
    kubectl apply -f "$REPO_ROOT/monitoring/grafana/"             > /dev/null 2>&1
    # Dashboards Grafana : ConfigMap généré depuis les fichiers JSON versionnés
    kubectl create configmap grafana-dashboards -n monitoring \
      --from-file="$REPO_ROOT/monitoring/grafana/dashboards" \
      --dry-run=client -o yaml 2>/dev/null | kubectl apply -f - > /dev/null 2>&1
    log_success "Stack monitoring appliquée (pods prêts après ~60s)"
  fi
fi

# ── Résumé ────────────────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}╔════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║            Environnement prêt          ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${GREEN}Jenkins${NC}    → http://localhost:8080"
echo -e "  ${GREEN}SonarQube${NC}  → http://localhost:9000"
echo -e "  ${GREEN}K8s${NC}        → kubectl get pods -n $K8S_NAMESPACE"
echo ""
echo -e "  ${YELLOW}Frontend${NC}   → kubectl port-forward service/frontend-service 3000:80 -n $K8S_NAMESPACE"
echo -e "  ${YELLOW}Login${NC}      → admin@test.com / #admin123   (sur http://localhost:3000/login)"
echo -e "  ${YELLOW}Grafana${NC}    → kubectl port-forward -n monitoring svc/grafana 3001:3000   (admin/admin)"
echo -e "  ${YELLOW}Prometheus${NC} → kubectl port-forward -n monitoring svc/prometheus 9090:9090"
echo -e "  ${YELLOW}Alertmanager${NC} → kubectl port-forward -n monitoring svc/alertmanager 9093:9093"
echo ""
