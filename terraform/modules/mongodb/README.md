# Module MongoDB

Module Terraform pour déployer MongoDB sur Kubernetes avec persistance optionnelle.

## Utilisation

```hcl
module "mongodb" {
  source = "../../modules/mongodb"

  namespace      = "my-namespace"
  mongo_password = var.mongo_password
  
  storage_size   = "5Gi"
  replicas       = 1
  
  enable_persistence = true
  
  labels = {
    app         = "mongodb"
    environment = "prod"
  }
}
```

## Resources créées

- `kubernetes_secret_v1` : Credentials MongoDB
- `kubernetes_persistent_volume_claim_v1` : Stockage (si enabled)
- `kubernetes_deployment_v1` : Deployment MongoDB
- `kubernetes_service_v1` : Service ClusterIP

## Outputs

- `deployment_name` : Nom du deployment
- `service_name` : Nom du service
- `service_cluster_ip` : IP interne
- `port` : Port MongoDB
- `connection_string` : URI de connexion (sensible)
