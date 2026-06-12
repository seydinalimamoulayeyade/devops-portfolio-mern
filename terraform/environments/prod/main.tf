# environments/prod/main.tf
# Configuration Terraform pour l'environnement de PRODUCTION

# ══════════════════════════════════════════════════════════════════════════════
# MODULE NAMESPACE
# ══════════════════════════════════════════════════════════════════════════════

module "namespace" {
  source = "../../modules/namespace"

  namespace_name = var.namespace_name
  labels         = local.common_labels
  
  annotations = {
    "description" = "Namespace pour le projet ${var.project_name} - environnement PRODUCTION"
    "managed-by"  = "terraform"
    "environment" = var.environment
  }

  # Activer les quotas et limites en production
  enable_resource_quota = var.enable_resource_quota
  enable_limit_range    = var.enable_limit_range

  # Quotas pour production
  quota_cpu_request    = "4"
  quota_cpu_limit      = "8"
  quota_memory_request = "4Gi"
  quota_memory_limit   = "8Gi"
  quota_pods           = "20"
}

# ══════════════════════════════════════════════════════════════════════════════
# MODULE MONGODB
# ══════════════════════════════════════════════════════════════════════════════

module "mongodb" {
  source = "../../modules/mongodb"

  namespace = module.namespace.namespace_name

  # Configuration MongoDB
  deployment_name = local.mongodb_deployment_name
  service_name    = local.mongodb_service_name
  pvc_name        = local.mongodb_pvc_name
  secret_name     = local.mongodb_secret_name
  
  image           = var.mongo_image
  port            = var.mongo_port
  replicas        = var.mongo_replicas
  database_name   = var.mongo_database
  mongo_password  = var.mongo_password

  # Stockage (plus grand en production)
  enable_persistence = var.enable_mongo_persistence
  storage_size       = var.mongo_storage_size
  storage_class      = var.mongo_storage_class

  # Resources (augmentées pour production)
  cpu_request    = "500m"
  cpu_limit      = "2000m"
  memory_request = "512Mi"
  memory_limit   = "2Gi"

  # Labels
  labels      = local.mongodb_labels
  annotations = local.monitoring_annotations

  # Image pull policy
  image_pull_policy = local.image_pull_policy

  # Health checks
  liveness_probe_enabled  = true
  readiness_probe_enabled = true
  startup_probe_enabled   = true

  depends_on = [module.namespace]
}

# ══════════════════════════════════════════════════════════════════════════════
# MODULE BACKEND
# ══════════════════════════════════════════════════════════════════════════════

module "backend" {
  source = "../../modules/backend"

  namespace = module.namespace.namespace_name

  # Configuration Backend
  deployment_name = local.backend_deployment_name
  service_name    = local.backend_service_name
  configmap_name  = local.backend_configmap_name
  
  image    = var.backend_image
  port     = var.backend_port
  replicas = var.backend_replicas
  node_env = var.node_env

  # Secrets
  jwt_secret = var.jwt_secret
  mongo_uri  = local.mongo_uri

  # Resources (augmentées pour production)
  cpu_request    = var.backend_cpu_request
  cpu_limit      = var.backend_cpu_limit
  memory_request = var.backend_memory_request
  memory_limit   = var.backend_memory_limit

  # Labels
  labels      = local.backend_labels
  annotations = local.monitoring_annotations

  # Image pull policy
  image_pull_policy = local.image_pull_policy

  # Health checks
  enable_health_checks = true

  depends_on = [module.mongodb]
}

# ══════════════════════════════════════════════════════════════════════════════
# MODULE FRONTEND
# ══════════════════════════════════════════════════════════════════════════════

module "frontend" {
  source = "../../modules/frontend"

  namespace = module.namespace.namespace_name

  # Configuration Frontend
  deployment_name = local.frontend_deployment_name
  service_name    = local.frontend_service_name
  configmap_name  = local.frontend_configmap_name
  
  image    = var.frontend_image
  port     = var.frontend_port
  nodeport = var.frontend_nodeport
  replicas = var.frontend_replicas

  # API URLs
  vite_api_url        = var.vite_api_url
  backend_service_url = "http://${module.backend.service_name}:${var.backend_port}"

  # Resources (augmentées pour production)
  cpu_request    = var.frontend_cpu_request
  cpu_limit      = var.frontend_cpu_limit
  memory_request = var.frontend_memory_request
  memory_limit   = var.frontend_memory_limit

  # Labels
  labels      = local.frontend_labels
  annotations = local.monitoring_annotations

  # Image pull policy
  image_pull_policy = local.image_pull_policy

  # Health checks
  enable_health_checks = true

  depends_on = [module.backend]
}
