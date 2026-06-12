# Module Backend

Module Terraform pour déployer l'API Express sur Kubernetes.

## Utilisation

```hcl
module "backend" {
  source = "../../modules/backend"

  namespace  = "my-namespace"
  image      = "lims4/backend:latest"
  jwt_secret = var.jwt_secret
  mongo_uri  = module.mongodb.connection_string
  
  replicas   = 2
  node_env   = "production"
  
  cpu_request    = "200m"
  memory_request = "256Mi"
  
  labels = {
    app         = "backend"
    environment = "prod"
  }
}
```

## Resources créées

- `kubernetes_config_map_v1` : Configuration (NODE_ENV, PORT)
- `kubernetes_secret_v1` : Secrets (JWT_SECRET, MONGO_URI)
- `kubernetes_deployment_v1` : Deployment Backend
- `kubernetes_service_v1` : Service ClusterIP

## Outputs

- `deployment_name` : Nom du deployment
- `service_name` : Nom du service
- `service_cluster_ip` : IP interne
- `port` : Port HTTP
- `api_url` : URL complète de l'API
