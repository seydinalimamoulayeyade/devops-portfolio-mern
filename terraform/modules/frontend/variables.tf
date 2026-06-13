# modules/frontend/variables.tf

variable "namespace" {
  description = "Namespace Kubernetes"
  type        = string
}

variable "deployment_name" {
  description = "Nom du Deployment"
  type        = string
  default     = "frontend-deployment"
}

variable "service_name" {
  description = "Nom du Service"
  type        = string
  default     = "frontend-service"
}

variable "configmap_name" {
  description = "Nom du ConfigMap"
  type        = string
  default     = "frontend-config"
}

variable "image" {
  description = "Image Docker Frontend"
  type        = string
}

variable "image_pull_policy" {
  description = "Image pull policy"
  type        = string
  default     = "IfNotPresent"
}

variable "port" {
  description = "Port interne du conteneur"
  type        = number
  default     = 80
}

variable "nodeport" {
  description = "NodePort pour accès externe"
  type        = number
  default     = 30080
}

variable "replicas" {
  description = "Nombre de replicas"
  type        = number
  default     = 1
}

# ═══════════════════════════════════════════════════════════════════════════════
# API CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════════

variable "vite_api_url" {
  description = "URL de l'API pour Vite (build time)"
  type        = string
}

variable "backend_service_url" {
  description = "URL interne du service backend"
  type        = string
}

variable "backend_service_name" {
  description = "Nom du service backend (pour la variable d'environnement BACKEND_HOST)"
  type        = string
  default     = "backend-service"
}

# ═══════════════════════════════════════════════════════════════════════════════
# RESOURCES
# ═══════════════════════════════════════════════════════════════════════════════

variable "cpu_request" {
  description = "CPU request"
  type        = string
  default     = "50m"
}

variable "cpu_limit" {
  description = "CPU limit"
  type        = string
  default     = "250m"
}

variable "memory_request" {
  description = "Mémoire request"
  type        = string
  default     = "64Mi"
}

variable "memory_limit" {
  description = "Mémoire limit"
  type        = string
  default     = "256Mi"
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
