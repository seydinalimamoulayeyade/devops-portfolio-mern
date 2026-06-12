# Guide Terraform - DevOps Portfolio MERN

Guide complet pour utiliser Terraform avec ce projet.

## 📖 Table des matières

1. [Introduction](#introduction)
2. [Structure](#structure)
3. [Environnements](#environnements)
4. [Démarrage rapide](#démarrage-rapide)
5. [Workflows courants](#workflows-courants)
6. [Bonnes pratiques](#bonnes-pratiques)

## Introduction

Ce projet utilise Terraform pour gérer l'infrastructure Kubernetes de manière déclarative et reproductible.

### Avantages de Terraform

✅ **Infrastructure as Code** : Infrastructure versionnée avec Git  
✅ **Multi-environnements** : dev et prod séparés  
✅ **Modules réutilisables** : Code DRY  
✅ **State management** : Suivi des changements  
✅ **Plan before apply** : Prévisualisation des modifications  

## Structure

```
terraform/
├── environments/
│   ├── dev/           # Développement
│   └── prod/          # Production
└── modules/           # Modules réutilisables
    ├── namespace/
    ├── mongodb/
    ├── backend/
    └── frontend/
```

## Environnements

### Dev
- Resources limitées
- 1 réplica par service
- Image pull: Always
- State: Local

### Prod
- Resources augmentées
- 2+ réplicas (HA)
- Image pull: IfNotPresent
- State: Remote obligatoire
- Quotas activés

## Démarrage rapide

```bash
# 1. Naviguer vers l'environnement
cd terraform/environments/dev

# 2. Configurer
cp terraform.tfvars.example terraform.tfvars
nano terraform.tfvars

# 3. Déployer
terraform init
terraform plan -out=tfplan
terraform apply tfplan
```

## Workflows courants

### Mettre à jour les réplicas

```bash
# Dans terraform.tfvars
backend_replicas = 3

# Appliquer
terraform apply
```

### Changer l'image Docker

```bash
# Dans terraform.tfvars
backend_image = "lims4/backend:v2.0.0"

# Appliquer
terraform apply
```

### Passer de dev à prod

```bash
cd ../prod
terraform init
terraform apply
```

## Bonnes pratiques

1. **Toujours faire un plan** avant apply
2. **Utiliser des tags versionnés** en prod
3. **Backend distant** obligatoire en prod
4. **Ne jamais commiter** terraform.tfvars
5. **Secrets forts** (32+ caractères)
6. **Minimum 2 réplicas** en prod

---

**Plus d'informations** : [terraform/README.md](../terraform/README.md)
