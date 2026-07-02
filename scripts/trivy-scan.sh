#!/bin/bash
# =============================================================================
#  trivy-scan.sh — Scan de sécurité local avec Trivy (étape 07 du fil rouge)
# -----------------------------------------------------------------------------
#  Démontre les CIBLES et SCANNERS de Trivy sur ce projet :
#    • filesystem / repo   → vuln + secret + misconfig + license
#    • config (IaC)        → misconfig sur Dockerfile, Terraform, Kubernetes
#    • container image     → vuln + secret (backend & frontend)
#
#  Formats de sortie générés dans trivy-reports/ : table (console), json, sarif, html.
#  Politique : CRITICAL => échec (exit 1) ; HIGH => rapporté (non bloquant).
#
#  Usage :
#    ./scripts/trivy-scan.sh [all|repo|iac|image]   (défaut : all)
#
#  Prérequis : Docker (Trivy est exécuté via l'image officielle, rien à installer).
# =============================================================================
set -u

# ── Chemins ───────────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
REPORTS_DIR="$REPO_ROOT/trivy-reports"

# ── Configuration (surchargeable par variables d'environnement) ───────────────
TRIVY_IMAGE="${TRIVY_IMAGE:-aquasec/trivy:0.58.1}"
DOCKERHUB_USER="${DOCKERHUB_USER:-lims4}"
BACKEND_IMAGE="${BACKEND_IMAGE:-${DOCKERHUB_USER}/devops-portfolio-mern-backend:latest}"
FRONTEND_IMAGE="${FRONTEND_IMAGE:-${DOCKERHUB_USER}/devops-portfolio-mern-frontend:latest}"
TARGET="${1:-all}"

# ── Couleurs ──────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; CYAN='\033[0;36m'; NC='\033[0m'
info()  { echo -e "${CYAN}[INFO]${NC} $1"; }
ok()    { echo -e "${GREEN}[OK]${NC}   $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
err()   { echo -e "${RED}[ERR]${NC}  $1"; }

mkdir -p "$REPORTS_DIR"
EXIT_CODE=0

# ── Wrapper Trivy (via Docker) ────────────────────────────────────────────────
# - cache DB persistant (volume trivy-cache) : évite de re-télécharger la DB
# - montage du repo en lecture pour fs/config ; docker.sock pour image
# - montage du dossier de rapports
trivy() {
  docker run --rm \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v trivy-cache:/root/.cache/ \
    -v "$REPO_ROOT:/project" \
    -w /project \
    "$TRIVY_IMAGE" "$@"
}

# =============================================================================
#  1. REPO / FILESYSTEM  → vuln + secret + misconfig + license
# =============================================================================
scan_repo() {
  info "Scan FILESYSTEM du dépôt (vuln + secret + misconfig + license)..."
  # Rapport console (table)
  trivy fs --scanners vuln,secret,misconfig,license \
    --severity HIGH,CRITICAL --ignore-unfixed --no-progress /project
  # Rapports fichiers (json + sarif)
  trivy fs --scanners vuln,secret,misconfig,license \
    --severity HIGH,CRITICAL --ignore-unfixed --no-progress \
    --format json --output /project/trivy-reports/repo.json /project
  trivy fs --scanners vuln,secret,misconfig \
    --severity HIGH,CRITICAL --no-progress \
    --format sarif --output /project/trivy-reports/repo.sarif /project

  # Gate : échec si un SECRET est détecté (fuite = bloquant) ou une CRITICAL
  info "Gate secrets (bloquant)..."
  trivy fs --scanners secret --exit-code 1 --no-progress /project || {
    err "Secret(s) détecté(s) dans le dépôt → build bloqué."; EXIT_CODE=1; }
  info "Gate vulnérabilités CRITICAL (bloquant)..."
  trivy fs --scanners vuln --severity CRITICAL --ignore-unfixed \
    --exit-code 1 --no-progress /project || {
    err "Vulnérabilité(s) CRITICAL dans les dépendances → build bloqué."; EXIT_CODE=1; }
  ok "Scan repo terminé (rapports : trivy-reports/repo.json|.sarif)"
}

# =============================================================================
#  2. CONFIG / IaC  → misconfig (Dockerfile, Terraform, Kubernetes)
# =============================================================================
scan_iac() {
  info "Scan IaC des configurations (misconfig : Dockerfile, Terraform, K8s)..."
  trivy config --severity HIGH,CRITICAL /project
  trivy config --severity HIGH,CRITICAL \
    --format json --output /project/trivy-reports/iac.json /project

  # Non bloquant par défaut (recommandations de durcissement).
  # Pour rendre bloquant : décommenter la ligne suivante.
  # trivy config --severity CRITICAL --exit-code 1 /project || EXIT_CODE=1
  ok "Scan IaC terminé (rapport : trivy-reports/iac.json)"
}

# =============================================================================
#  3. CONTAINER IMAGE  → vuln + secret (backend & frontend)
# =============================================================================
scan_one_image() {
  local image="$1" name="$2"
  if ! docker image inspect "$image" >/dev/null 2>&1; then
    warn "Image '$image' absente en local — build-la d'abord (docker build). Ignorée."
    return
  fi
  info "Scan IMAGE $name : $image (vuln + secret)..."
  trivy image --scanners vuln,secret --severity HIGH,CRITICAL \
    --ignore-unfixed --no-progress "$image"
  # Rapport HTML lisible (template intégré à l'image Trivy) + JSON
  trivy image --scanners vuln,secret --severity HIGH,CRITICAL --ignore-unfixed --no-progress \
    --format template --template "@/contrib/html.tpl" \
    --output "/project/trivy-reports/image-$name.html" "$image"
  trivy image --scanners vuln,secret --severity HIGH,CRITICAL --ignore-unfixed --no-progress \
    --format json --output "/project/trivy-reports/image-$name.json" "$image"

  # Gate : CRITICAL bloquant
  trivy image --scanners vuln --severity CRITICAL --ignore-unfixed \
    --exit-code 1 --no-progress "$image" || {
    err "Vulnérabilité(s) CRITICAL dans l'image $name → build bloqué."; EXIT_CODE=1; }
  ok "Scan image $name terminé (trivy-reports/image-$name.html|.json)"
}

scan_images() {
  scan_one_image "$BACKEND_IMAGE"  "backend"
  scan_one_image "$FRONTEND_IMAGE" "frontend"
}

# ── Vérifs préalables ─────────────────────────────────────────────────────────
if ! docker info >/dev/null 2>&1; then
  err "Docker n'est pas lancé."; exit 1
fi

echo ""
echo -e "${CYAN}==== Trivy Security Scan — cible : $TARGET ====${NC}"
echo -e "Image Trivy : $TRIVY_IMAGE"
echo ""

case "$TARGET" in
  repo)  scan_repo ;;
  iac)   scan_iac ;;
  image) scan_images ;;
  all)   scan_repo; scan_iac; scan_images ;;
  *)     err "Cible inconnue : $TARGET (attendu : all|repo|iac|image)"; exit 2 ;;
esac

echo ""
if [ "$EXIT_CODE" -eq 0 ]; then
  ok "Tous les gates de sécurité sont passés."
else
  err "Des vulnérabilités/secrets bloquants ont été détectés."
fi
echo -e "Rapports détaillés : ${CYAN}$REPORTS_DIR${NC}"
exit "$EXIT_CODE"
