# Environment: Production (PROD)

Configuration Terraform pour l'environnement de PRODUCTION.

## ⚠️ Attention - Production

Cet environnement déploie sur **PRODUCTION**. Soyez **extrêmement prudent** avec toute modification.

## Caractéristiques

- **Namespace**: `devops-portfolio`
- **Node environment**: `production`
- **Resources**: Augmentées (2x dev minimum)
- **Replicas**: Minimum 2 pour HA (High Availability)
- **Image pull policy**: `IfNotPresent` (cache pour performance)
- **Persistence**: Activée (5Gi minimum)
- **Monitoring**: Activé par défaut
- **Quotas**: Activés
- **Backend distant**: OBLIGATOIRE

## Pré-requis

1. Backend distant configuré (Terraform Cloud / S3)
2. Secrets forts (32+ caractères)
3. Tags versionnés pour les images Docker
4. Cluster Kubernetes de production
5. Validation en staging d'abord

## Déploiement

```bash
cd terraform/environments/prod

# 1. Copier et éditer les variables
cp terraform.tfvars.example terraform.tfvars
# IMPORTANT: Utiliser des secrets TRÈS forts

# 2. Initialiser avec le backend distant
terraform init

# 3. Planifier et réviser ATTENTIVEMENT
terraform plan -out=tfplan

# 4. Appliquer SEULEMENT après validation
terraform apply tfplan
```

## Variables spécifiques

| Variable | Valeur par défaut | Description |
|----------|-------------------|-------------|
| `namespace_name` | `devops-portfolio` | Namespace |
| `node_env` | `production` | Mode Node.js |
| `mongo_database` | `filrouge` | Base de données |
| `backend_replicas` | `2` | Réplicas backend (min 2) |
| `frontend_replicas` | `2` | Réplicas frontend (min 2) |
| `enable_resource_quota` | `true` | Quotas activés |
| `enable_monitoring` | `true` | Prometheus activé |

## Resources

Resources augmentées pour la production :

- **MongoDB**: 500m CPU, 512Mi RAM (limit: 2 CPU, 2Gi)
- **Backend**: 200m CPU, 256Mi RAM (limit: 1 CPU, 1Gi)
- **Frontend**: 100m CPU, 128Mi RAM (limit: 500m CPU, 512Mi)

## Checklist avant déploiement

- [ ] Backend distant configuré
- [ ] Secrets forts générés (min 32 caractères)
- [ ] Images Docker taguées (pas de :latest)
- [ ] Plan Terraform révisé
- [ ] Tests en staging passés
- [ ] Backup de la base de données
- [ ] Équipe notifiée

## Commandes

```bash
# Voir les ressources
kubectl get all -n devops-portfolio

# Logs
kubectl logs -f deployment/backend-deployment -n devops-portfolio

# Scaler manuellement
kubectl scale deployment backend-deployment --replicas=3 -n devops-portfolio

# Rollback
terraform state pull > backup.tfstate
terraform apply -var="backend_image=previous-version"
```
