# modules/backend/outputs.tf

output "deployment_name" {
  description = "Nom du Deployment Backend"
  value       = kubernetes_deployment_v1.backend.metadata[0].name
}

output "service_name" {
  description = "Nom du Service Backend"
  value       = kubernetes_service_v1.backend.metadata[0].name
}

output "service_cluster_ip" {
  description = "Cluster IP du Service Backend"
  value       = kubernetes_service_v1.backend.spec[0].cluster_ip
}

output "port" {
  description = "Port Backend"
  value       = var.port
}

output "api_url" {
  description = "URL de l'API (interne)"
  value       = "http://${kubernetes_service_v1.backend.metadata[0].name}:${var.port}"
}
