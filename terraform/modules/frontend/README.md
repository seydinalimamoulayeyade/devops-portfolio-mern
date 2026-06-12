# Module Frontend

Module Terraform pour déployer le frontend React+Nginx sur Kubernetes.

## Utilisation

```hcl
module "frontend" {
  source = "../../modules/frontend"

  namespace           = "my-namespace"
  image               = "lims4/frontend:latest"
  vite_api_url        = "http://localhost:5000/api"
  backend_service_url = "http://backend-service:5000"
  
  replicas   = 2
  nodeport   = 30080
  
  cpu_request    = "100m"
  memory_request = "128Mi"
  
  labels = {
    app         = "frontend"
    environment = "prod"
  }
}
```

## Resources créées

- `kubernetes_config_map_v1` : Configuration (VITE_API_URL)
- `kubernetes_deployment_v1` : Deployment Frontend
- `kubernetes_service_v1` : Service NodePort

## Outputs

- `deployment_name` : Nom du deployment
- `service_name` : Nom du service
- `nodeport` : Port externe
- `port` : Port interne
- `access_url` : URL d'accès complet
