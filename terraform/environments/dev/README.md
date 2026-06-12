# Environment: Development (DEV)

Configuration Terraform pour l'environnement de développement.

## Caractéristiques

- **Namespace**: `devops-portfolio-dev`
- **Node environment**: `development`
- **Resources**: Limites réduites (dev local)
- **Image pull policy**: `Always` (toujours récupérer la dernière version)
- **Persistence**: Activée (1Gi)
- **Monitoring**: Désactivé par défaut

## Démarrage rapide

```bash
cd terraform/environments/dev

# 1. Copier et éditer les variables
cp terraform.tfvars.example terraform.tfvars
notepad terraform.tfvars

# 2. Initialiser
terraform init

# 3. Planifier
terraform plan -out=tfplan

# 4. Appliquer
terraform apply tfplan
```

## Accès

- **Frontend**: http://localhost:30080
- **Backend API**: http://backend-service:5000 (interne)
- **MongoDB**: mongodb://mongo-service:27017 (interne)

## Variables spécifiques

| Variable | Valeur par défaut | Description |
|----------|-------------------|-------------|
| `namespace_name` | `devops-portfolio-dev` | Nom du namespace |
| `node_env` | `development` | Mode Node.js |
| `mongo_database` | `filrouge-dev` | Base de données |
| `backend_replicas` | `1` | Réplicas backend |
| `frontend_replicas` | `1` | Réplicas frontend |

## Resources

Resources limitées pour économiser les ressources en dev :

- **MongoDB**: 100m CPU, 128Mi RAM
- **Backend**: 50m CPU, 64Mi RAM
- **Frontend**: 25m CPU, 32Mi RAM

## Commandes utiles

```bash
# Voir les ressources
kubectl get all -n devops-portfolio-dev

# Logs backend
kubectl logs -f deployment/backend-deployment -n devops-portfolio-dev

# Port-forward
kubectl port-forward svc/frontend-service 3000:80 -n devops-portfolio-dev

# Détruire l'environnement
terraform destroy
```
