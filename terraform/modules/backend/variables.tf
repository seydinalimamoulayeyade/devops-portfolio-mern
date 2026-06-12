# modules/backend/variables.tf

variable "namespace" {
  description = "Namespace Kubernetes"
  type        = string
}

variable "deployment_name" {
  description = "Nom du Deployment"
  type        = string
  default     = "backend-deployment"
}

variable "service_name" {
  description = "Nom du Service"
  type        = string
  default     = "backend-service"
}

variable "configmap_name" {
  description = "Nom du ConfigMap"
  type        = string
  default     = "backend-config"
}

variable "image" {
  description = "Image Docker Backend"
  type        = string
}

variable "image_pull_policy" {
  description = "Image pull policy"
  type        = string
  default     = "IfNotPresent"
}

variable "port" {
  description = "Port Backend"
  type        = number
  default     = 5000
}

variable "replicas" {
  description = "Nombre de replicas"
  type        = number
  default     = 1
}

variable "node_env" {
  description = "NODE_ENV (development/production)"
  type        = string
  default     = "production"
}

# ═══════════════════════════════════════════════════════════════════════════════
# SECRETS
# ═══════════════════════════════════════════════════════════════════════════════

variable "jwt_secret" {
  description = "JWT secret key"
  type        = string
  sensitive   = true

  validation {
    condition     = length(var.jwt_secret) >= 32
    error_message = "JWT secret doit contenir au moins 32 caractères"
  }
}

variable "mongo_uri" {
  description = "MongoDB connection URI"
  type        = string
  sensitive   = true
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

variable "enable_health_checks" {
  description = "Activer les health checks HTTP"
  type        = bool
  default     = true
}
