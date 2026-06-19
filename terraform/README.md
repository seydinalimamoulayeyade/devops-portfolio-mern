# Infrastructure Terraform

Infrastructure as Code des ressources Kubernetes de l'application, multi-environnements (`dev` / `prod`).
C'est la **source de vérité du déploiement** (le dossier `../k8s/` n'est que la version manuelle, pédagogique).

## Structure

```
terraform/
├── environments/
│   ├── dev/      # namespace devops-portfolio-dev, 1 replica, state local
│   └── prod/     # namespace devops-portfolio, HA, state distant
└── modules/
    ├── namespace/   mongodb/   backend/   frontend/
```

Chaque environnement a son `README.md` ; chaque module est réutilisable et paramétré par variables.

## Démarrage

```bash
cd environments/dev          # ou prod
cp terraform.tfvars.example terraform.tfvars   # puis renseigner les secrets
terraform init
terraform plan -out=tfplan
terraform apply tfplan
terraform output             # URLs, services, commandes kubectl utiles
```

## Environnements

| | dev | prod |
|---|---|---|
| Namespace | `devops-portfolio-dev` | `devops-portfolio` |
| Replicas | 1 | ≥ 2 (HA) |
| Ressources | réduites | augmentées + quotas |
| State | local | **distant obligatoire** (S3 ou Terraform Cloud) |

## Secrets & state — règles

- Ne **jamais** commiter `terraform.tfvars`, `*.tfstate*` (déjà couverts par `.gitignore`).
- Secrets forts (32+ caractères).
- En prod : tag d'image **immuable** (jamais `:latest`) + backend de state distant.

## Bonnes pratiques

- Toujours `terraform plan` avant `apply`.
- `terraform fmt -recursive` + `terraform validate` avant commit.
- Déploiements stateful (Mongo, PVC RWO) : `strategy = Recreate`.

## Dépannage rapide

| Problème | Commande |
|---|---|
| Modules non installés | `terraform init` |
| State verrouillé | `terraform force-unlock <LOCK_ID>` |
| Ressource déjà existante | `terraform import <addr> <id>` |

## Références

- [Terraform](https://developer.hashicorp.com/terraform/docs) · [Kubernetes Provider](https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs)
