# Module Namespace

Module Terraform pour créer et gérer un namespace Kubernetes avec quotas et limites optionnels.

## Utilisation

```hcl
module "namespace" {
  source = "../../modules/namespace"

  namespace_name = "my-namespace"
  
  labels = {
    environment = "dev"
    managed-by  = "terraform"
  }
  
  annotations = {
    description = "Mon namespace de dev"
  }

  # Activer en production
  enable_resource_quota = true
  enable_limit_range    = true
}
```

## Resources créées

- `kubernetes_namespace_v1` : Namespace principal
- `kubernetes_resource_quota_v1` : Quotas (optionnel)
- `kubernetes_limit_range_v1` : Limites par défaut (optionnel)

## Outputs

- `namespace_name` : Nom du namespace
- `namespace_id` : ID Kubernetes
- `namespace_uid` : UID unique
