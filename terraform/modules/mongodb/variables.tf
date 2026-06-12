# modules/mongodb/variables.tf

variable "namespace" {
  description = "Namespace Kubernetes"
  type        = string
}

variable "deployment_name" {
  description = "Nom du Deployment"
  type        = string
  default     = "mongo-deployment"
}

variable "service_name" {
  description = "Nom du Service"
  type        = string
  default     = "mongo-service"
}

variable "pvc_name" {
  description = "Nom du PersistentVolumeClaim"
  type        = string
  default     = "mongo-pvc"
}

variable "secret_name" {
  description = "Nom du Secret"
  type        = string
  default     = "mongo-secret"
}

variable "image" {
  description = "Image Docker MongoDB"
  type        = string
  default     = "mongo:7"
}

variable "image_pull_policy" {
  description = "Image pull policy"
  type        = string
  default     = "IfNotPresent"
}

variable "port" {
  description = "Port MongoDB"
  type        = number
  default     = 27017
}

variable "replicas" {
  description = "Nombre de replicas"
  type        = number
  default     = 1
}

variable "database_name" {
  description = "Nom de la base de données"
  type        = string
  default     = "filrouge"
}

variable "mongo_password" {
  description = "Mot de passe MongoDB"
  type        = string
  sensitive   = true
}

# ═══════════════════════════════════════════════════════════════════════════════
# STORAGE
# ═══════════════════════════════════════════════════════════════════════════════

variable "enable_persistence" {
  description = "Activer le stockage persistant"
  type        = bool
  default     = true
}

variable "storage_size" {
  description = "Taille du stockage persistant"
  type        = string
  default     = "1Gi"
}

variable "storage_class" {
  description = "Storage class pour le PVC"
  type        = string
  default     = ""
}

# ═══════════════════════════════════════════════════════════════════════════════
# RESOURCES
# ═══════════════════════════════════════════════════════════════════════════════

variable "cpu_request" {
  description = "CPU request"
  type        = string
  default     = "100m"
}

variable "cpu_limit" {
  description = "CPU limit"
  type        = string
  default     = "500m"
}

variable "memory_request" {
  description = "Mémoire request"
  type        = string
  default     = "128Mi"
}

variable "memory_limit" {
  description = "Mémoire limit"
  type        = string
  default     = "512Mi"
}

# ═══════════════════════════════════════════════════════════════════════════════
# LABELS & ANNOTATIONS
# ═══════════════════════════════════════════════════════════════════════════════

variable "labels" {
  description = "Labels à appliquer"
  type        = map(string)
  default     = {}
}

variable "annotations" {
  description = "Annotations à appliquer"
  type        = map(string)
  default     = {}
}

# ═══════════════════════════════════════════════════════════════════════════════
# HEALTH CHECKS
# ═══════════════════════════════════════════════════════════════════════════════

variable "liveness_probe_enabled" {
  description = "Activer liveness probe"
  type        = bool
  default     = true
}

variable "readiness_probe_enabled" {
  description = "Activer readiness probe"
  type        = bool
  default     = true
}

variable "startup_probe_enabled" {
  description = "Activer startup probe"
  type        = bool
  default     = true
}
