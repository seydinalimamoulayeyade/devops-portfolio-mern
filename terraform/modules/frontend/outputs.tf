# modules/frontend/outputs.tf

output "deployment_name" {
  description = "Nom du Deployment Frontend"
  value       = kubernetes_deployment_v1.frontend.metadata[0].name
}

output "service_name" {
  description = "Nom du Service Frontend"
  value       = kubernetes_service_v1.frontend.metadata[0].name
}

output "nodeport" {
  description = "NodePort pour accès externe"
  value       = var.nodeport
}

output "port" {
  description = "Port interne"
  value       = var.port
}

output "access_url" {
  description = "URL d'accès au frontend"
  value       = "http://localhost:${var.nodeport}"
}
