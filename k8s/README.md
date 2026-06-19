# Manifests Kubernetes (étape 04 du fil rouge)

Ce dossier contient les **manifests Kubernetes écrits à la main**. Il correspond à
l'**étape 04 — Kubernetes** du parcours DevOps : apprendre à décrire et déployer
l'application avec des objets K8s bruts (`Namespace`, `Deployment`, `Service`, `PVC`,
`Secret`, `ConfigMap`, RBAC).

## Relation avec `terraform/`

Ce projet est un **fil rouge progressif**. Le déploiement existe en **deux versions
complémentaires**, chacune représentant une étape de la montée en compétence :

| Dossier        | Étape | Rôle |
|----------------|-------|------|
| `k8s/`         | 04 — Kubernetes | Manifests **manuels** : on apprend les objets K8s en les écrivant à la main. Référence pédagogique. |
| `terraform/`   | 05 — Terraform  | **Industrialisation** des mêmes ressources en Infrastructure as Code (modules réutilisables, environnements dev/prod). |

> **Source de vérité du déploiement réel : `terraform/`.**
> Le pipeline CI/CD (Jenkins) s'appuie sur l'infrastructure gérée par Terraform.
> Les manifests de `k8s/` sont conservés comme **référence d'apprentissage** et pour
> illustrer la progression « manuel → industrialisé », pas comme outil de déploiement actif.

## Utilisation (déploiement manuel — pédagogique)

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secret.yaml -f k8s/configmap.yaml
kubectl apply -f k8s/mongo/
kubectl apply -f k8s/backend/
kubectl apply -f k8s/frontend/
```

> ⚠️ Ne pas mélanger les deux approches sur le **même** namespace en même temps :
> choisir soit le déploiement manuel (`k8s/`), soit Terraform (`terraform/environments/dev`),
> pour éviter que les deux outils ne se disputent les mêmes ressources.

## Contenu

| Fichier | Rôle |
|---------|------|
| `namespace.yaml` | Namespace `devops-portfolio` |
| `secret.yaml` | Secrets (JWT, Mongo) |
| `configmap.yaml` | Configuration non sensible |
| `jenkins-rbac.yaml` | ServiceAccount + Role/RoleBinding pour le déploiement par Jenkins |
| `mongo/` | Déploiement MongoDB + Service + PVC |
| `backend/` | Déploiement Backend + Service |
| `frontend/` | Déploiement Frontend + Service NodePort |
