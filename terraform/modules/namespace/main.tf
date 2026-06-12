# modules/namespace/main.tf
# Module pour créer et gérer un namespace Kubernetes

resource "kubernetes_namespace_v1" "main" {
  metadata {
    name        = var.namespace_name
    labels      = var.labels
    annotations = var.annotations
  }
}

# Quota de ressources (optionnel - prod)
resource "kubernetes_resource_quota_v1" "namespace_quota" {
  count = var.enable_resource_quota ? 1 : 0

  metadata {
    name      = "${var.namespace_name}-quota"
    namespace = kubernetes_namespace_v1.main.metadata[0].name
  }

  spec {
    hard = {
      "requests.cpu"    = var.quota_cpu_request
      "requests.memory" = var.quota_memory_request
      "limits.cpu"      = var.quota_cpu_limit
      "limits.memory"   = var.quota_memory_limit
      "pods"            = var.quota_pods
    }
  }
}

# Limit range pour limiter les resources individuelles (optionnel - prod)
resource "kubernetes_limit_range_v1" "namespace_limits" {
  count = var.enable_limit_range ? 1 : 0

  metadata {
    name      = "${var.namespace_name}-limits"
    namespace = kubernetes_namespace_v1.main.metadata[0].name
  }

  spec {
    limit {
      type = "Container"
      
      default = {
        cpu    = var.default_cpu_limit
        memory = var.default_memory_limit
      }
      
      default_request = {
        cpu    = var.default_cpu_request
        memory = var.default_memory_request
      }
      
      max = {
        cpu    = var.max_cpu
        memory = var.max_memory
      }
    }
  }
}
