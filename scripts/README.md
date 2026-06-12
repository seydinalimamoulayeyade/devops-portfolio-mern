# Scripts utilitaires

Scripts shell pour automatiser les tâches DevOps courantes.

## Scripts disponibles

### start-devops.sh
Script de démarrage de l'infrastructure DevOps locale.

**Utilisation** :
```bash
./scripts/start-devops.sh
```

**Ce qu'il fait** :
- Démarre Jenkins
- Lance SonarQube + PostgreSQL
- Configure ngrok pour les webhooks GitHub (si nécessaire)
- Affiche le statut des services

## Ajouter un script

Pour ajouter un nouveau script utilitaire :
1. Créer le fichier dans ce dossier
2. Le rendre exécutable : `chmod +x scripts/mon-script.sh`
3. Documenter son utilisation ici

## Scripts backend

Les scripts spécifiques au backend (comme `seedAdmin.js`) restent dans `backend/scripts/`.
