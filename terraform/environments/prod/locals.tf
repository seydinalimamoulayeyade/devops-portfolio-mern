# environments/prod/locals.tf
# Variables locales calculées pour l'environnement PRODUCTION

locals {
  # Labels communs avec plus de métadonnées pour production
  common_labels = merge(
    {
      "app.kubernetes.io/name"       = var.project_name
      "app.kubernetes.io/instance"   = "${var.project_name}-${var.environment}"
      "app.kubernetes.io/version"    = "1.0.0"
      "app.kubernetes.io/managed-by" = "terraform"
      "environment"                  = var.environment
      "project"                      = var.project_name
      "criticality"                  = "high"
    },
    var.common_labels
  )

  # Labels MongoDB
  mongodb_labels = merge(
    local.common_labels,
    {
      "app.kubernetes.io/component" = "database"
      "app.kubernetes.io/part-of"   = var.project_name
      "tier"                        = "database"
    }
  )

  # Labels Backend
  backend_labels = merge(
    local.common_labels,
    {
      "app.kubernetes.io/component" = "api"
      "app.kubernetes.io/part-of"   = var.project_name
      "tier"                        = "backend"
    }
  )

  # Labels Frontend
  frontend_labels = merge(
    local.common_labels,
    {
      "app.kubernetes.io/component" = "web"
      "app.kubernetes.io/part-of"   = var.project_name
      "tier"                        = "frontend"
    }
  )

  # Annotations monitoring (activées par défaut en prod)
  monitoring_annotations = var.enable_monitoring ? {
    "prometheus.io/scrape" = "true"
    "prometheus.io/port"   = "metrics"
    "prometheus.io/path"   = "/metrics"
  } : {}

  # Connexion MongoDB
  mongo_uri = "mongodb://mongo-service:${var.mongo_port}/${var.mongo_database}"

  # Noms des ressources MongoDB
  mongodb_deployment_name = "mongo-deployment"
  mongodb_service_name    = "mongo-service"
  mongodb_pvc_name        = "mongo-pvc"
  mongodb_secret_name     = "mongo-secret"

  # Noms des ressources Backend
  backend_deployment_name = "backend-deployment"
  backend_service_name    = "backend-service"
  backend_configmap_name  = "backend-config"

  # Noms des ressources Frontend
  frontend_deployment_name = "frontend-deployment"
  frontend_service_name    = "frontend-service"
  frontend_configmap_name  = "frontend-config"

  # Image pull policy (IfNotPresent pour prod - cache)
  image_pull_policy = "IfNotPresent"
}
