# environments/dev/variables.tf
# Variables spécifiques à l'environnement DEV

variable "kubeconfig_path" {
  description = "Chemin vers le fichier kubeconfig"
  type        = string
  default     = "~/.kube/config"
}

variable "kube_context" {
  description = "Contexte Kubernetes à utiliser"
  type        = string
  default     = "docker-desktop"
}

variable "namespace_name" {
  description = "Nom du namespace"
  type        = string
  default     = "devops-portfolio-dev"
}

variable "environment" {
  description = "Nom de l'environnement"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Nom du projet"
  type        = string
  default     = "devops-portfolio-mern"
}

# Secrets
variable "jwt_secret" {
  description = "Secret JWT"
  type        = string
  sensitive   = true
}

variable "mongo_password" {
  description = "Mot de passe MongoDB"
  type        = string
  sensitive   = true
}

# MongoDB
variable "mongo_image" {
  type    = string
  default = "mongo:7"
}

variable "mongo_database" {
  type    = string
  default = "filrouge-dev"
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
  default = "1Gi"
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
  default = 1
}

variable "node_env" {
  type    = string
  default = "development"
}

variable "backend_cpu_request" {
  type    = string
  default = "50m"
}

variable "backend_cpu_limit" {
  type    = string
  default = "250m"
}

variable "backend_memory_request" {
  type    = string
  default = "64Mi"
}

variable "backend_memory_limit" {
  type    = string
  default = "256Mi"
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
  default = 1
}

variable "vite_api_url" {
  type    = string
  default = "/api"
}

variable "frontend_cpu_request" {
  type    = string
  default = "25m"
}

variable "frontend_cpu_limit" {
  type    = string
  default = "100m"
}

variable "frontend_memory_request" {
  type    = string
  default = "32Mi"
}

variable "frontend_memory_limit" {
  type    = string
  default = "128Mi"
}

# Common
variable "common_labels" {
  type    = map(string)
  default = {}
}

variable "enable_monitoring" {
  type    = bool
  default = false
}
