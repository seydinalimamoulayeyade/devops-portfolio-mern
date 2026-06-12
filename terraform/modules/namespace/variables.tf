# modules/namespace/variables.tf

variable "namespace_name" {
  description = "Nom du namespace Kubernetes"
  type        = string
}

variable "labels" {
  description = "Labels à appliquer au namespace"
  type        = map(string)
  default     = {}
}

variable "annotations" {
  description = "Annotations à appliquer au namespace"
  type        = map(string)
  default     = {}
}

# ═══════════════════════════════════════════════════════════════════════════════
# RESOURCE QUOTA
# ═══════════════════════════════════════════════════════════════════════════════

variable "enable_resource_quota" {
  description = "Activer les quotas de ressources au niveau du namespace"
  type        = bool
  default     = false
}

variable "quota_cpu_request" {
  description = "Quota CPU request pour le namespace"
  type        = string
  default     = "4"
}

variable "quota_cpu_limit" {
  description = "Quota CPU limit pour le namespace"
  type        = string
  default     = "8"
}

variable "quota_memory_request" {
  description = "Quota mémoire request pour le namespace"
  type        = string
  default     = "4Gi"
}

variable "quota_memory_limit" {
  description = "Quota mémoire limit pour le namespace"
  type        = string
  default     = "8Gi"
}

variable "quota_pods" {
  description = "Nombre maximum de pods dans le namespace"
  type        = string
  default     = "20"
}

# ═══════════════════════════════════════════════════════════════════════════════
# LIMIT RANGE
# ═══════════════════════════════════════════════════════════════════════════════

variable "enable_limit_range" {
  description = "Activer les limites par défaut pour les conteneurs"
  type        = bool
  default     = false
}

variable "default_cpu_request" {
  description = "CPU request par défaut pour les conteneurs"
  type        = string
  default     = "50m"
}

variable "default_cpu_limit" {
  description = "CPU limit par défaut pour les conteneurs"
  type        = string
  default     = "500m"
}

variable "default_memory_request" {
  description = "Mémoire request par défaut pour les conteneurs"
  type        = string
  default     = "64Mi"
}

variable "default_memory_limit" {
  description = "Mémoire limit par défaut pour les conteneurs"
  type        = string
  default     = "512Mi"
}

variable "max_cpu" {
  description = "CPU maximum pour un conteneur"
  type        = string
  default     = "2"
}

variable "max_memory" {
  description = "Mémoire maximum pour un conteneur"
  type        = string
  default     = "2Gi"
}
