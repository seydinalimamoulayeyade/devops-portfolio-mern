# environments/prod/outputs.tf

output "namespace_name" {
  description = "Nom du namespace"
  value       = module.namespace.namespace_name
}

output "mongodb_service_name" {
  description = "Nom du service MongoDB"
  value       = module.mongodb.service_name
}

output "mongodb_connection_string" {
  description = "Chaîne de connexion MongoDB"
  value       = module.mongodb.connection_string
  sensitive   = true
}

output "backend_service_name" {
  description = "Nom du service backend"
  value       = module.backend.service_name
}

output "backend_api_url" {
  description = "URL interne de l'API backend"
  value       = module.backend.api_url
}

output "backend_replicas" {
  description = "Nombre de réplicas backend"
  value       = var.backend_replicas
}

output "frontend_service_name" {
  description = "Nom du service frontend"
  value       = module.frontend.service_name
}

output "frontend_nodeport" {
  description = "NodePort du frontend"
  value       = module.frontend.nodeport
}

output "frontend_replicas" {
  description = "Nombre de réplicas frontend"
  value       = var.frontend_replicas
}

output "frontend_access_url" {
  description = "URL d'accès au frontend"
  value       = "http://localhost:${module.frontend.nodeport}"
}

output "kubectl_commands" {
  description = "Commandes kubectl utiles pour production"
  value = {
    get_all          = "kubectl get all -n ${module.namespace.namespace_name}"
    get_pods         = "kubectl get pods -n ${module.namespace.namespace_name} -w"
    logs_backend     = "kubectl logs -n ${module.namespace.namespace_name} deployment/${module.backend.deployment_name} -f"
    logs_frontend    = "kubectl logs -n ${module.namespace.namespace_name} deployment/${module.frontend.deployment_name} -f"
    describe_backend = "kubectl describe deployment -n ${module.namespace.namespace_name} ${module.backend.deployment_name}"
    port_forward     = "kubectl port-forward -n ${module.namespace.namespace_name} service/${module.frontend.service_name} 3000:80"
    scale_backend    = "kubectl scale deployment -n ${module.namespace.namespace_name} ${module.backend.deployment_name} --replicas=3"
  }
}

output "deployment_summary" {
  description = "Résumé du déploiement production"
  value = {
    namespace         = module.namespace.namespace_name
    environment       = var.environment
    project           = var.project_name
    mongodb_image     = var.mongo_image
    backend_image     = var.backend_image
    backend_replicas  = var.backend_replicas
    frontend_image    = var.frontend_image
    frontend_replicas = var.frontend_replicas
    persistence       = var.enable_mongo_persistence
    storage_size      = var.mongo_storage_size
    monitoring        = var.enable_monitoring
    quotas_enabled    = var.enable_resource_quota
  }
}
