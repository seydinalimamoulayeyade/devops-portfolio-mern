# modules/frontend/main.tf
# Module pour déployer le frontend React+Nginx sur Kubernetes

# ═══════════════════════════════════════════════════════════════════════════════
# CONFIGMAP
# ═══════════════════════════════════════════════════════════════════════════════

resource "kubernetes_config_map_v1" "frontend" {
  metadata {
    name      = var.configmap_name
    namespace = var.namespace
    labels    = var.labels
  }

  data = {
    VITE_API_URL        = var.vite_api_url
    BACKEND_SERVICE_URL = var.backend_service_url
  }
}

# ═══════════════════════════════════════════════════════════════════════════════
# DEPLOYMENT
# ═══════════════════════════════════════════════════════════════════════════════

resource "kubernetes_deployment_v1" "frontend" {
  metadata {
    name        = var.deployment_name
    namespace   = var.namespace
    labels      = var.labels
    annotations = var.annotations
  }

  spec {
    replicas = var.replicas

    # Recreate : arrête l'ancien pod avant de créer le nouveau.
    # Évite de devoir héberger 2 pods simultanément (cluster mono-node à court de CPU).
    strategy {
      type = "Recreate"
    }

    selector {
      match_labels = {
        app = "frontend"
      }
    }

    template {
      metadata {
        labels = merge(
          var.labels,
          {
            app = "frontend"
          }
        )
      }

      spec {
        container {
          name              = "frontend"
          image             = var.image
          image_pull_policy = var.image_pull_policy

          port {
            name           = "http"
            container_port = var.port
            protocol       = "TCP"
          }

          # Variable d'environnement pour le nom du service backend
          env {
            name  = "BACKEND_HOST"
            value = var.backend_service_name
          }

          # Environment variables from ConfigMap
          env_from {
            config_map_ref {
              name = kubernetes_config_map_v1.frontend.metadata[0].name
            }
          }

          # Resources
          resources {
            requests = {
              cpu    = var.cpu_request
              memory = var.memory_request
            }
            limits = {
              cpu    = var.cpu_limit
              memory = var.memory_limit
            }
          }

          # Liveness probe
          dynamic "liveness_probe" {
            for_each = var.enable_health_checks ? [1] : []
            content {
              http_get {
                path = "/"
                port = var.port
              }
              initial_delay_seconds = 30
              period_seconds        = 10
              timeout_seconds       = 5
              failure_threshold     = 3
            }
          }

          # Readiness probe
          dynamic "readiness_probe" {
            for_each = var.enable_health_checks ? [1] : []
            content {
              http_get {
                path = "/"
                port = var.port
              }
              initial_delay_seconds = 10
              period_seconds        = 5
              timeout_seconds       = 3
              failure_threshold     = 3
            }
          }

          # Startup probe
          dynamic "startup_probe" {
            for_each = var.enable_health_checks ? [1] : []
            content {
              http_get {
                path = "/"
                port = var.port
              }
              initial_delay_seconds = 0
              period_seconds        = 5
              timeout_seconds       = 3
              failure_threshold     = 30
            }
          }
        }
      }
    }
  }
}

# ═══════════════════════════════════════════════════════════════════════════════
# SERVICE - NodePort
# ═══════════════════════════════════════════════════════════════════════════════

resource "kubernetes_service_v1" "frontend" {
  metadata {
    name      = var.service_name
    namespace = var.namespace
    labels    = var.labels
  }

  spec {
    type = "NodePort"

    selector = {
      app = "frontend"
    }

    port {
      name        = "http"
      port        = var.port
      target_port = var.port
      node_port   = var.nodeport
      protocol    = "TCP"
    }
  }
}
