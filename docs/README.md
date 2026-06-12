# Documentation - DevOps Portfolio MERN

Guide complet des outils DevOps utilisés dans le projet.

## 📚 Table des matières

1. [Docker & Docker Compose](./01-DOCKER.md) - Conteneurisation
2. [Jenkins](./02-JENKINS.md) - Pipeline CI/CD
3. [SonarQube](./03-SONARQUBE.md) - Qualité de code
4. [Kubernetes](./04-KUBERNETES.md) - Orchestration
5. [Terraform](./05-TERRAFORM.md) - Infrastructure as Code

## 🎯 Vue d'ensemble du projet

```
┌─────────────────────────────────────────────────────────┐
│                  WORKFLOW DEVOPS                        │
│                                                         │
│  1. Code → Git Push                                     │
│      │                                                  │
│      ▼                                                  │
│  2. Jenkins (webhook)                                   │
│      │                                                  │
│      ├─ Tests (Jest)                                    │
│      ├─ SonarQube (qualité)                             │
│      ├─ Docker Build                                     │
│      ├─ Docker Push (Hub)                               │
│      └─ Deploy K8s                                       │
│          │                                              │
│          ▼                                              │
│  3. Kubernetes                                          │
│      │                                                  │
│      ├─ MongoDB (PVC)                                   │
│      ├─ Backend (Express)                               │
│      └─ Frontend (React)                                │
│                                                         │
│  Alternative: Terraform pour gérer K8s                  │
└─────────────────────────────────────────────────────────┘
```

## 🔧 Outils par fonction

### Développement
- **Node.js 22** : Runtime JavaScript
- **React 19 + Vite** : Framework frontend
- **Express** : Framework backend
- **MongoDB 7** : Base de données
- **Jest** : Tests unitaires

### Conteneurisation
- **Docker** : Empaquetage en conteneurs
- **Docker Compose** : Orchestration locale

### CI/CD
- **Jenkins** : Automatisation du pipeline
- **GitHub** : Versionning + webhook

### Qualité
- **SonarQube** : Analyse de code
- **Jest** : Coverage 80.3%

### Déploiement
- **Kubernetes** : Orchestration production
- **Terraform** : Infrastructure as Code

## 📊 Pipeline complet

```
Developer
    │
    │ git push
    ▼
GitHub
    │
    │ webhook
    ▼
Jenkins
    │
    ├─ [1] Checkout
    ├─ [2] Tests (59 tests)
    ├─ [3] SonarQube
    ├─ [4] Quality Gate
    ├─ [5] Docker Build
    └─ [6] Deploy K8s
          │
          ▼
    Kubernetes Cluster
          │
          ├─ MongoDB Pod
          ├─ Backend Pod
          └─ Frontend Pod
                │
                ▼
            Production
        http://localhost:30080
```

## 🚀 Démarrage rapide

### Option 1 : Docker Compose (dev local)
```bash
docker compose up --build
# → http://localhost
```

### Option 2 : Kubernetes (manifests)
```bash
kubectl apply -f k8s/
# → http://localhost:30080
```

### Option 3 : Terraform (IaC)
```bash
cd terraform/environments/dev
terraform init
terraform apply
# → http://localhost:30080
```

## 📖 Lectures recommandées

### Par ordre d'apprentissage
1. **[Docker](./01-DOCKER.md)** - Comprendre la conteneurisation
2. **[Jenkins](./02-JENKINS.md)** - Automatisation du pipeline
3. **[SonarQube](./03-SONARQUBE.md)** - Qualité de code
4. **[Kubernetes](./04-KUBERNETES.md)** - Orchestration
5. **[Terraform](./05-TERRAFORM.md)** - Infrastructure as Code

### Par besoin
- **Débuter** : Docker → Docker Compose
- **CI/CD** : Jenkins → SonarQube
- **Production** : Kubernetes
- **Automatisation** : Terraform

## 🎓 Compétences acquises

### Module 1 : Docker
- ✅ Dockerfile multi-stage
- ✅ Docker Compose
- ✅ Volumes et réseaux
- ✅ Health checks

### Module 2 : Jenkins
- ✅ Pipeline déclaratif
- ✅ Intégration GitHub
- ✅ Gestion des credentials
- ✅ Notifications email

### Module 3 : SonarQube
- ✅ Quality Gates
- ✅ Coverage analysis
- ✅ Security scanning
- ✅ Code smells detection

### Module 4 : Kubernetes
- ✅ Deployments
- ✅ Services (ClusterIP, NodePort)
- ✅ ConfigMaps et Secrets
- ✅ PersistentVolumes
- ✅ Health checks
- ✅ Rolling updates

### Module 5 : Terraform
- ✅ Modules réutilisables
- ✅ Multi-environnements
- ✅ State management
- ✅ Variables et outputs
- ✅ Provider Kubernetes

## 🔗 Ressources externes

### Documentation officielle
- [Docker Docs](https://docs.docker.com/)
- [Jenkins Handbook](https://www.jenkins.io/doc/book/)
- [SonarQube Docs](https://docs.sonarqube.org/)
- [Kubernetes Docs](https://kubernetes.io/docs/)
- [Terraform Docs](https://www.terraform.io/docs)

### Tutoriels
- [Docker for Beginners](https://docker-curriculum.com/)
- [Jenkins Pipeline Tutorial](https://www.jenkins.io/doc/book/pipeline/)
- [Kubernetes Basics](https://kubernetes.io/docs/tutorials/kubernetes-basics/)
- [Terraform Getting Started](https://learn.hashicorp.com/terraform)

## 💡 Bonnes pratiques

### Général
- ✅ Versionner tout (code + infra)
- ✅ Automatiser au maximum
- ✅ Tester avant de déployer
- ✅ Monitorer en production

### Docker
- ✅ Multi-stage builds
- ✅ Images légères (Alpine)
- ✅ .dockerignore
- ✅ Health checks

### Kubernetes
- ✅ Namespaces pour isolation
- ✅ Resource limits
- ✅ ConfigMaps/Secrets
- ✅ Rolling updates

### Terraform
- ✅ Modules réutilisables
- ✅ State distant (prod)
- ✅ Variables typées
- ✅ terraform plan avant apply

## 🚨 Troubleshooting

### Problème courant : Pods en CrashLoopBackOff
```bash
# Voir les logs
kubectl logs <pod-name> -n devops-portfolio

# Describe pour plus de détails
kubectl describe pod <pod-name> -n devops-portfolio
```

### Problème : Quality Gate échoue
1. Consulter SonarQube : http://localhost:9000
2. Voir les issues détectées
3. Corriger le code
4. Nouveau commit

### Problème : Terraform state locked
```bash
terraform force-unlock <LOCK_ID>
```

## 📞 Support

Pour plus d'aide :
- Consulter les README dans chaque dossier
- Voir les logs : `kubectl logs`, `docker logs`
- Vérifier la doc officielle des outils

---

**Auteur** : Seydina Limamou Laye Yade  
**Formation** : Cloud AWS & DevOps — Orange Digital Center (ODC)  
**Date** : Juin 2026
