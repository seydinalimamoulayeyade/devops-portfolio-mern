# Scripts utilitaires

Scripts d'automatisation pour l'environnement DevOps **local**.

## `start-devops.sh`

Bootstrap de l'environnement local après un redémarrage machine.

```bash
./scripts/start-devops.sh   # exécutable depuis n'importe quel répertoire
```

**Ce qu'il fait :**
1. Vérifie que Docker Desktop est lancé.
2. Démarre le conteneur **Jenkins**.
3. Démarre **SonarQube** (`docker-compose.sonar.yml`).
4. Met à jour le kubeconfig dans Jenkins (accès au cluster depuis le conteneur).
5. Déploie l'application via **Terraform** (`terraform/environments/dev`, namespace `devops-portfolio-dev`) si les pods ne tournent pas déjà.

> Prérequis pour l'étape 5 : `terraform/environments/dev/terraform.tfvars` doit exister
> (copié depuis `terraform.tfvars.example`). Sinon l'étape est ignorée avec un avertissement.

> Le déclenchement du pipeline Jenkins se fait par **polling Git** (pas de webhook externe requis).

## Note

Les scripts spécifiques au backend (ex. `seedAdmin.js`) restent dans `backend/scripts/`.
