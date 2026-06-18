# modules/mongodb/main.tf
# Module pour déployer MongoDB sur Kubernetes

# ═══════════════════════════════════════════════════════════════════════════════
# SECRET
# ═══════════════════════════════════════════════════════════════════════════════

resource "kubernetes_secret_v1" "mongo" {
  metadata {
    name      = var.secret_name
    namespace = var.namespace
    labels    = var.labels
  }

  data = {
    mongodb-password = var.mongo_password
    mongodb-database = var.database_name
  }

  type = "Opaque"
}

# ═══════════════════════════════════════════════════════════════════════════════
# PERSISTENT VOLUME CLAIM
# ═══════════════════════════════════════════════════════════════════════════════

resource "kubernetes_persistent_volume_claim_v1" "mongo" {
  count = var.enable_persistence ? 1 : 0

  wait_until_bound = false # Ne pas attendre que le PVC soit bound (sera bound quand le Pod démarrera)

  metadata {
    name      = var.pvc_name
    namespace = var.namespace
    labels    = var.labels
  }

  spec {
    access_modes = ["ReadWriteOnce"]

    resources {
      requests = {
        storage = var.storage_size
      }
    }

    storage_class_name = var.storage_class
  }
}

# ═══════════════════════════════════════════════════════════════════════════════
# DEPLOYMENT
# ═══════════════════════════════════════════════════════════════════════════════

resource "kubernetes_deployment_v1" "mongo" {
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
        app = "mongo"
      }
    }

    template {
      metadata {
        labels = merge(
          var.labels,
          {
            app = "mongo"
          }
        )
      }

      spec {
        container {
          name              = "mongodb"
          image             = var.image
          image_pull_policy = var.image_pull_policy

          port {
            name           = "mongo"
            container_port = var.port
            protocol       = "TCP"
          }

          env {
            name  = "MONGO_INITDB_ROOT_USERNAME"
            value = "admin"
          }

          env {
            name = "MONGO_INITDB_ROOT_PASSWORD"
            value_from {
              secret_key_ref {
                name = kubernetes_secret_v1.mongo.metadata[0].name
                key  = "mongodb-password"
              }
            }
          }

          env {
            name = "MONGO_INITDB_DATABASE"
            value_from {
              secret_key_ref {
                name = kubernetes_secret_v1.mongo.metadata[0].name
                key  = "mongodb-database"
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

          # Volume mount
          dynamic "volume_mount" {
            for_each = var.enable_persistence ? [1] : []
            content {
              name       = "mongo-data"
              mount_path = "/data/db"
            }
          }

          # Liveness probe
          dynamic "liveness_probe" {
            for_each = var.liveness_probe_enabled ? [1] : []
            content {
              exec {
                command = ["mongosh", "--eval", "db.adminCommand('ping')"]
              }
              initial_delay_seconds = 30
              period_seconds        = 10
              timeout_seconds       = 5
              failure_threshold     = 3
            }
          }

          # Readiness probe
          dynamic "readiness_probe" {
            for_each = var.readiness_probe_enabled ? [1] : []
            content {
              exec {
                command = ["mongosh", "--eval", "db.adminCommand('ping')"]
              }
              initial_delay_seconds = 10
              period_seconds        = 5
              timeout_seconds       = 3
              failure_threshold     = 3
            }
          }

          # Startup probe
          dynamic "startup_probe" {
            for_each = var.startup_probe_enabled ? [1] : []
            content {
              exec {
                command = ["mongosh", "--eval", "db.adminCommand('ping')"]
              }
              initial_delay_seconds = 0
              period_seconds        = 5
              timeout_seconds       = 3
              failure_threshold     = 30
            }
          }
        }

        # Volume
        dynamic "volume" {
          for_each = var.enable_persistence ? [1] : []
          content {
            name = "mongo-data"
            persistent_volume_claim {
              claim_name = kubernetes_persistent_volume_claim_v1.mongo[0].metadata[0].name
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

resource "kubernetes_service_v1" "mongo" {
  metadata {
    name      = var.service_name
    namespace = var.namespace
    labels    = var.labels
  }

  spec {
    type = "ClusterIP"

    selector = {
      app = "mongo"
    }

    port {
      name        = "mongo"
      port        = var.port
      target_port = var.port
      protocol    = "TCP"
    }
  }
}
