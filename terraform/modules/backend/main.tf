# modules/backend/main.tf
# Module pour déployer le backend Express sur Kubernetes

# ═══════════════════════════════════════════════════════════════════════════════
# CONFIGMAP
# ═══════════════════════════════════════════════════════════════════════════════

resource "kubernetes_config_map_v1" "backend" {
  metadata {
    name      = var.configmap_name
    namespace = var.namespace
    labels    = var.labels
  }

  data = {
    NODE_ENV = var.node_env
    PORT     = tostring(var.port)
  }
}

# ═══════════════════════════════════════════════════════════════════════════════
# SECRET
# ═══════════════════════════════════════════════════════════════════════════════

resource "kubernetes_secret_v1" "backend" {
  metadata {
    name      = "${var.deployment_name}-secret"
    namespace = var.namespace
    labels    = var.labels
  }

  data = {
    JWT_SECRET = var.jwt_secret
    MONGO_URI  = var.mongo_uri
  }

  type = "Opaque"
}

# ═══════════════════════════════════════════════════════════════════════════════
# DEPLOYMENT
# ═══════════════════════════════════════════════════════════════════════════════

resource "kubernetes_deployment_v1" "backend" {
  metadata {
    name        = var.deployment_name
    namespace   = var.namespace
    labels      = var.labels
    annotations = var.annotations
  }

  spec {
    replicas = var.replicas

    selector {
      match_labels = {
        app = "backend"
      }
    }

    template {
      metadata {
        labels = merge(
          var.labels,
          {
            app = "backend"
          }
        )
      }

      spec {
        container {
          name              = "backend"
          image             = var.image
          image_pull_policy = var.image_pull_policy

          port {
            name           = "http"
            container_port = var.port
            protocol       = "TCP"
          }

          # Environment variables from ConfigMap
          env_from {
            config_map_ref {
              name = kubernetes_config_map_v1.backend.metadata[0].name
            }
          }

          # Environment variables from Secret
          env {
            name = "JWT_SECRET"
            value_from {
              secret_key_ref {
                name = kubernetes_secret_v1.backend.metadata[0].name
                key  = "JWT_SECRET"
              }
            }
          }

          env {
            name = "MONGO_URI"
            value_from {
              secret_key_ref {
                name = kubernetes_secret_v1.backend.metadata[0].name
                key  = "MONGO_URI"
              }
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
                path = "/api/health"
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
                path = "/api/health"
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
                path = "/api/health"
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
# SERVICE
# ═══════════════════════════════════════════════════════════════════════════════

resource "kubernetes_service_v1" "backend" {
  metadata {
    name      = var.service_name
    namespace = var.namespace
    labels    = var.labels
  }

  spec {
    type = "ClusterIP"

    selector = {
      app = "backend"
    }

    port {
      name        = "http"
      port        = var.port
      target_port = var.port
      protocol    = "TCP"
    }
  }
}
