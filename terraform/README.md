# Infrastructure Terraform - DevOps Portfolio MERN

Infrastructure as Code (IaC) complète avec gestion multi-environnements (dev/prod).

## 📋 Structure du projet

```
terraform/
├── environments/
│   ├── dev/                    # Environnement de développement
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   ├── locals.tf
│   │   ├── providers.tf
│   │   ├── versions.tf
│   │   ├── backend.tf
│   │   ├── terraform.tfvars.example
│   │   └── README.md
│   │
│   └── prod/                   # Environnement de production
│       ├── main.tf
│       ├── variables.tf
│       ├── outputs.tf
│       ├── locals.tf
│       ├── providers.tf
│       ├── versions.tf
│       ├── backend.tf
│       ├── terraform.tfvars.example
│       └── README.md
│
├── modules/                    # Modules réutilisables
│   ├── namespace/              # Module Kubernetes namespace
│   ├── mongodb/                # Module MongoDB
│   ├── backend/                # Module Backend API
│   └── frontend/               # Module Frontend React
│
├── README.md                   # Ce fichier
├── QUICKSTART.md               # Guide de démarrage rapide
├── ARCHITECTURE.md             # Documentation d'architecture
├── init.ps1                    # Script d'initialisation Windows
├── Makefile                    # Commandes rapides (Linux/Mac)
└── .gitignore                  # Fichiers à ignorer
```

## 🚀 Démarrage rapide

### 1. Choisir un environnement

```bash
# Développement
cd environments/dev

# Production
cd environments/prod
```

### 2. Configuration

```bash
# Copier l'exemple
cp terraform.tfvars.example terraform.tfvars

# Éditer les secrets
notepad terraform.tfvars  # Windows
# ou
nano terraform.tfvars     # Linux/Mac
```

### 3. Déploiement

```bash
terraform init
terraform plan -out=tfplan
terraform apply tfplan
```

📖 **Guide complet** : Voir [QUICKSTART.md](./QUICKSTART.md)

## 🏗️ Environnements

### Development (dev)

- **Namespace**: `devops-portfolio-dev`
- **Resources**: Limitées (optimisé pour dev local)
- **Replicas**: 1 par service
- **State**: Local (par défaut)
- **Monitoring**: Désactivé

**Utilisation** :
```bash
cd environments/dev
terraform apply
```

### Production (prod)

- **Namespace**: `devops-portfolio`
- **Resources**: Augmentées
- **Replicas**: 2 minimum (HA)
- **State**: Remote obligatoire
- **Monitoring**: Activé
- **Quotas**: Activés

**Utilisation** :
```bash
cd environments/prod
terraform apply
```

## 📦 Modules

### namespace
Crée et gère le namespace Kubernetes avec quotas et limites optionnels.

### mongodb
Déploie MongoDB avec :
- PersistentVolumeClaim
- Secret pour credentials
- Health checks
- Resource limits

### backend
Déploie l'API Express avec :
- Deployment + Service ClusterIP
- ConfigMap + Secret
- Health checks
- Auto-scaling ready

### frontend  
Déploie React + Nginx avec :
- Deployment + Service NodePort
- ConfigMap
- Health checks

## 🔐 Gestion des secrets

**Ne JAMAIS commiter** :
- `terraform.tfvars`
- `*.tfstate`
- `*.tfstate.backup`

**Générer des secrets forts** :
```powershell
# PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

```bash
# Linux/Mac
openssl rand -base64 32
```

## 🌐 Backend State

### Développement
State local (fichier `terraform.tfstate`)

### Production  
⚠️ **OBLIGATOIRE** : Configurer un backend distant

**Terraform Cloud** :
```hcl
terraform {
  cloud {
    organization = "mon-org"
    workspaces {
      name = "devops-portfolio-prod"
    }
  }
}
```

**AWS S3** :
```hcl
terraform {
  backend "s3" {
    bucket = "my-terraform-state"
    key    = "devops-portfolio/prod/terraform.tfstate"
    region = "us-east-1"
    encrypt = true
    dynamodb_table = "terraform-locks"
  }
}
```

## 📊 Outputs

Chaque environnement expose :
- URLs d'accès
- Noms des services
- Commandes kubectl utiles
- Résumé du déploiement

```bash
terraform output
```

## 🔄 Workflows courants

### Mettre à jour une variable

```bash
# Éditer terraform.tfvars
notepad terraform.tfvars

# Appliquer
terraform plan -out=tfplan
terraform apply tfplan
```

### Scaler les réplicas

```bash
# Dans terraform.tfvars
backend_replicas = 3
frontend_replicas = 2

# Appliquer
terraform apply -auto-approve
```

### Changer d'environnement

```bash
# Dev → Prod
cd ../prod
terraform init
terraform workspace select prod  # Si workspaces utilisés
```

### Détruire un environnement

```bash
terraform destroy
```

⚠️ **Attention** : Supprime TOUTES les ressources (namespace, PVC, etc.)

## 🧪 Validation

```bash
# Formater
terraform fmt -recursive

# Valider
terraform validate

# Linter (optionnel)
tflint
```

## 📚 Documentation

- [QUICKSTART.md](./QUICKSTART.md) - Guide de démarrage
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture détaillée
- [environments/dev/README.md](./environments/dev/README.md) - Env dev
- [environments/prod/README.md](./environments/prod/README.md) - Env prod

## 💡 Bonnes pratiques

✅ **À faire** :
- Toujours `terraform plan` avant `apply`
- Utiliser des tags versionnés en prod
- Configurer un backend distant en prod
- Activer les quotas en prod
- Minimum 2 réplicas en prod
- Secrets forts (32+ caractères)

❌ **À éviter** :
- Commiter `terraform.tfvars`
- Utiliser `:latest` en prod
- State local en prod
- Secrets faibles
- `terraform apply -auto-approve` sans plan

## 🐛 Troubleshooting

### Modules not installed
```bash
terraform init
```

### State locked
```bash
terraform force-unlock <LOCK_ID>
```

### Namespace already exists
```bash
terraform import module.namespace.kubernetes_namespace_v1.main <namespace-name>
```

## 📖 Références

- [Terraform Documentation](https://www.terraform.io/docs)
- [Kubernetes Provider](https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs)
- [Best Practices](https://www.terraform-best-practices.com/)

---

**Auteur** : Seydina Limamou Laye Yade  
**Formation** : Cloud AWS & DevOps — Orange Digital Center (ODC)
