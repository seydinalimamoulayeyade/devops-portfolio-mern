# environments/prod/variables.tf
# Variables spécifiques à l'environnement PRODUCTION

variable "kubeconfig_path" {
  description = "Chemin vers le fichier kubeconfig"
  type        = string
  default     = "~/.kube/config"
}

variable "kube_context" {
  description = "Contexte Kubernetes à utiliser"
  type        = string
  default     = null
}

variable "namespace_name" {
  description = "Nom du namespace"
  type        = string
  default     = "devops-portfolio"
}

variable "environment" {
  description = "Nom de l'environnement"
  type        = string
  default     = "prod"
}

variable "project_name" {
  description = "Nom du projet"
  type        = string
  default     = "devops-portfolio-mern"
}

# Secrets
variable "jwt_secret" {
  description = "Secret JWT pour production (minimum 32 caractères)"
  type        = string
  sensitive   = true

  validation {
    condition     = length(var.jwt_secret) >= 32
    error_message = "Le JWT secret doit contenir au moins 32 caractères en production."
  }
}

variable "mongo_password" {
  description = "Mot de passe MongoDB pour production (minimum 16 caractères)"
  type        = string
  sensitive   = true

  validation {
    condition     = length(var.mongo_password) >= 16
    error_message = "Le mot de passe MongoDB doit contenir au moins 16 caractères en production."
  }
}

# MongoDB
variable "mongo_image" {
  type    = string
  default = "mongo:7"
}

variable "mongo_database" {
  type    = string
  default = "filrouge"
}

variable "mongo_port" {
  type    = number
  default = 27017
}

variable "mongo_replicas" {
  type    = number
  default = 1
}

variable "enable_mongo_persistence" {
  type    = bool
  default = true
}

variable "mongo_storage_size" {
  type    = string
  default = "5Gi"
}

variable "mongo_storage_class" {
  type    = string
  default = null
}

# Backend
variable "backend_image" {
  type    = string
  default = "lims4/devops-portfolio-mern-backend:latest"
}

variable "backend_port" {
  type    = number
  default = 5000
}

variable "backend_replicas" {
  type    = number
  default = 2

  validation {
    condition     = var.backend_replicas >= 2
    error_message = "En production, au moins 2 réplicas backend sont recommandés."
  }
}

variable "node_env" {
  type    = string
  default = "production"
}

variable "backend_cpu_request" {
  type    = string
  default = "200m"
}

variable "backend_cpu_limit" {
  type    = string
  default = "1000m"
}

variable "backend_memory_request" {
  type    = string
  default = "256Mi"
}

variable "backend_memory_limit" {
  type    = string
  default = "1Gi"
}

# Frontend
variable "frontend_image" {
  type    = string
  default = "lims4/devops-portfolio-mern-frontend:latest"
}

variable "frontend_port" {
  type    = number
  default = 80
}

variable "frontend_nodeport" {
  type    = number
  default = 30080
}

variable "frontend_replicas" {
  type    = number
  default = 2

  validation {
    condition     = var.frontend_replicas >= 2
    error_message = "En production, au moins 2 réplicas frontend sont recommandés."
  }
}

variable "vite_api_url" {
  type    = string
  default = "/api"
}

variable "frontend_cpu_request" {
  type    = string
  default = "100m"
}

variable "frontend_cpu_limit" {
  type    = string
  default = "500m"
}

variable "frontend_memory_request" {
  type    = string
  default = "128Mi"
}

variable "frontend_memory_limit" {
  type    = string
  default = "512Mi"
}

# Common
variable "common_labels" {
  type    = map(string)
  default = {}
}

variable "enable_monitoring" {
  type    = bool
  default = true
}

# Resource quotas (activés en production)
variable "enable_resource_quota" {
  type    = bool
  default = true
}

variable "enable_limit_range" {
  type    = bool
  default = true
}
