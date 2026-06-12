# modules/namespace/outputs.tf

output "namespace_name" {
  description = "Nom du namespace créé"
  value       = kubernetes_namespace_v1.main.metadata[0].name
}

output "namespace_id" {
  description = "ID du namespace créé"
  value       = kubernetes_namespace_v1.main.id
}

output "namespace_uid" {
  description = "UID du namespace créé"
  value       = kubernetes_namespace_v1.main.metadata[0].uid
}
