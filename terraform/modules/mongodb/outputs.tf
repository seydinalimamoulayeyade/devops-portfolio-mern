# modules/mongodb/outputs.tf

output "deployment_name" {
  description = "Nom du Deployment MongoDB"
  value       = kubernetes_deployment_v1.mongo.metadata[0].name
}

output "service_name" {
  description = "Nom du Service MongoDB"
  value       = kubernetes_service_v1.mongo.metadata[0].name
}

output "service_cluster_ip" {
  description = "Cluster IP du Service MongoDB"
  value       = kubernetes_service_v1.mongo.spec[0].cluster_ip
}

output "port" {
  description = "Port MongoDB"
  value       = var.port
}

output "connection_string" {
  description = "Connection string MongoDB (interne)"
  value       = "mongodb://${kubernetes_service_v1.mongo.metadata[0].name}:${var.port}/${var.database_name}"
  sensitive   = true
}
