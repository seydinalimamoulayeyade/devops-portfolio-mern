# devops-portfolio-mern

> Application fullstack MERN — projet fil rouge de la formation Cloud & DevOps à l'Orange Digital Center (ODC).  
> Pipeline CI/CD complet : Tests → Qualité → Build → Déploiement Kubernetes automatisé.

![Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?style=flat-square&logo=react)
![Docker](https://img.shields.io/badge/Docker-Containerisé-2496ED?style=flat-square&logo=docker)
![Jenkins](https://img.shields.io/badge/Jenkins-Pipeline%206%20stages-D24939?style=flat-square&logo=jenkins)
![SonarQube](https://img.shields.io/badge/SonarQube-Quality%20Gate%20✓-4E9BCD?style=flat-square&logo=sonarqube)
![Jest](https://img.shields.io/badge/Jest-59%20tests%20%7C%2080.3%25-C21325?style=flat-square&logo=jest)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Déployé-326CE5?style=flat-square&logo=kubernetes)
![Docker Hub](https://img.shields.io/badge/Docker%20Hub-lims4-2496ED?style=flat-square&logo=docker)
![License](https://img.shields.io/badge/Licence-MIT-green?style=flat-square)

---

## Présentation

**devops-portfolio-mern** est une application de gestion de portfolio technique, conçue pour servir de projet fil rouge tout au long de la formation DevOps. Chaque module ajoute une couche concrète au même projet — de la conteneurisation Docker jusqu'au déploiement Kubernetes automatisé via Jenkins.

### Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 19 + Vite + Tailwind CSS v4 |
| Backend | Node.js 22 LTS + Express |
| Base de données | MongoDB 7 + Mongoose |
| Auth | JWT (JSON Web Tokens) |
| Upload | Multer (stockage local) |
| Conteneurisation | Docker + Docker Compose |
| CI/CD | Jenkins (Pipeline 6 stages) |
| Qualité code | SonarQube 10.7 + Quality Gate |
| Tests | Jest 29 + Supertest + mongodb-memory-server |
| Orchestration | Kubernetes (Docker Desktop) |

---

## Pipeline CI/CD

Chaque `git push` sur `main` déclenche automatiquement le pipeline Jenkins complet :

```
git push
    │
    ▼
[1] Checkout          — récupère le code, calcule le tag versionné (date + commit hash)
    │
    ▼
[2] Backend Tests     — Jest 59 tests, coverage LCOV (80.3%)
    │
    ▼
[3] SonarQube         — analyse qualité JS/CSS (33 fichiers, 0 bug, 0 vulnerability)
    │
    ▼
[4] Quality Gate      — bloque si coverage < 80% ou issues détectées
    │
    ▼
[5] Build & Push      — docker build + docker push (latest + tag versionné)
    │
    ▼
[6] Deploy K8s        — kubectl apply + rollout restart + rollout status
```

### Métriques qualité

| Métrique | Valeur |
|----------|--------|
| Tests | 59 passés / 0 échoué |
| Coverage global | 80.3% |
| Bugs SonarQube | 0 |
| Vulnerabilities | 0 |
| Code Smells | 0 (new code) |
| Duplications | 0.0% |
| Quality Gate | ✅ PASSED |

---

## Architecture Kubernetes

```
                    ┌──────────────────────────────────────────┐
                    │       Namespace: devops-portfolio         │
                    │                                           │
Browser :3000 ────► │  frontend-service (NodePort :30080)       │
  (port-forward)    │       │                                   │
                    │       ▼                                   │
                    │  frontend Pod (nginx :80)                 │
                    │       │ /api/*                            │
                    │       ▼                                   │
                    │  backend-service (ClusterIP :5000)        │
                    │       │                                   │
                    │       ▼                                   │
                    │  backend Pod (Express :5000)              │
                    │       │                                   │
                    │       ▼                                   │
                    │  mongo-service (ClusterIP :27017)         │
                    │       │                                   │
                    │       ▼                                   │
                    │  mongo Pod (MongoDB :27017)               │
                    │       │                                   │
                    │       ▼                                   │
                    │  mongo-pvc (PersistentVolume 1Gi)         │
                    └──────────────────────────────────────────┘
```

### Objets K8s déployés

| Objet | Nom | Rôle |
|-------|-----|------|
| Namespace | devops-portfolio | Isolation du projet |
| Secret | mern-secret | JWT_SECRET, MONGO_PASSWORD, MONGO_URI |
| ConfigMap | mern-config | NODE_ENV, PORT, VITE_API_URL |
| Deployment | mongo-deployment | MongoDB 7 — 1 replica |
| Deployment | backend-deployment | Express API — 1 replica |
| Deployment | frontend-deployment | Nginx/React — 1 replica |
| Service ClusterIP | mongo-service | DNS interne MongoDB |
| Service ClusterIP | backend-service | DNS interne Backend |
| Service NodePort | frontend-service | Port 30080 externe |
| PVC | mongo-pvc | Stockage persistant 1Gi |
| ServiceAccount | jenkins-deployer | Identité Jenkins dans K8s |
| Role + RoleBinding | jenkins-deploy-role | Droits limités au namespace |

---

## Images Docker Hub

| Service | Image |
|---------|-------|
| Frontend | `docker pull lims4/devops-portfolio-mern-frontend:latest` |
| Backend | `docker pull lims4/devops-portfolio-mern-backend:latest` |

---

## Structure du projet

```
devops-portfolio-mern/
├── frontend/                    # Application React (Vite)
│   ├── src/
│   │   ├── components/          # Composants UI réutilisables
│   │   ├── pages/               # Vues / routes
│   │   ├── context/             # État global (AuthContext)
│   │   ├── services/            # Appels API (axios)
│   │   └── hooks/               # Custom hooks
│   ├── .dockerignore
│   ├── Dockerfile               # Multi-stage build (Node.js → Nginx)
│   └── package.json
├── backend/                     # API Node.js / Express
│   ├── src/
│   │   ├── __tests__/           # Tests Jest (59 tests, 5 suites)
│   │   │   ├── utils.test.js
│   │   │   ├── authMiddleware.test.js
│   │   │   ├── health.test.js
│   │   │   ├── auth.test.js
│   │   │   └── projects.test.js
│   │   ├── config/              # Connexion MongoDB
│   │   ├── controllers/         # Logique métier
│   │   ├── middleware/          # Auth, upload
│   │   ├── models/              # Schémas Mongoose
│   │   └── routes/              # Endpoints REST
│   ├── .dockerignore
│   ├── Dockerfile
│   └── package.json
├── k8s/                         # Manifests Kubernetes
│   ├── namespace.yaml
│   ├── secret.yaml
│   ├── configmap.yaml
│   ├── jenkins-rbac.yaml
│   ├── mongo/
│   │   ├── pvc.yaml
│   │   ├── deployment.yaml
│   │   └── service.yaml
│   ├── backend/
│   │   ├── deployment.yaml
│   │   └── service.yaml
│   └── frontend/
│       ├── deployment.yaml
│       └── service.yaml
├── docker-compose.yml           # Stack applicative locale
├── docker-compose.sonar.yml     # Infrastructure SonarQube + PostgreSQL
├── Jenkinsfile                  # Pipeline CI/CD 6 stages
├── sonar-project.properties     # Configuration SonarQube
├── .gitignore
└── README.md
```

---

## Démarrage rapide

### Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé et lancé
- Git

### Option 1 — Docker Compose (développement local)

```bash
git clone https://github.com/seydinalimamoulayeyade/devops-portfolio-mern.git
cd devops-portfolio-mern
cp .env.example .env
cp backend/.env.example backend/.env
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost |
| Backend API | http://localhost:5000/api |
| Health check | http://localhost:5000/api/health |

### Option 2 — Kubernetes (Docker Desktop)

```bash
# Prérequis : Kubernetes activé dans Docker Desktop

# 1. Créer le namespace
kubectl apply -f k8s/namespace.yaml

# 2. Appliquer les secrets et la configuration
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/configmap.yaml

# 3. Déployer MongoDB
kubectl apply -f k8s/mongo/

# 4. Déployer Backend et Frontend
kubectl apply -f k8s/backend/
kubectl apply -f k8s/frontend/

# 5. Accéder à l'application (Docker Desktop Windows)
kubectl port-forward service/frontend-service 3000:80 -n devops-portfolio
```

Ouvrir **http://localhost:3000**

---

## Tests

```bash
cd backend

# Lancer les tests avec coverage
npm test

# Mode CI (sans interactivité)
npm run test:ci
```

### Suites de tests

| Suite | Type | Tests |
|-------|------|-------|
| utils.test.js | Unitaire | 15 — normalizeTechnologies, cleanProjectPayload |
| authMiddleware.test.js | Unitaire | 10 — protect, requireAdmin |
| health.test.js | Intégration | 6 — GET /, /api/health, /api/auth |
| auth.test.js | Intégration | 6 — login complet (mongodb-memory-server) |
| projects.test.js | Intégration | 22 — CRUD /api/projets (mongodb-memory-server) |

---

## API REST

### Projets

```
GET    /api/projets          Liste tous les projets (public)
GET    /api/projets/:id      Détail d'un projet (public)
POST   /api/projets          Créer un projet (admin requis)
PUT    /api/projets/:id      Modifier un projet (admin requis)
DELETE /api/projets/:id      Supprimer un projet (admin requis)
```

### Authentification

```
POST   /api/auth/register    Désactivé — 403
POST   /api/auth/login       Connexion — retourne un token JWT
GET    /api/health           Statut du serveur → { "status": "ok" }
```

### Compte administrateur

```bash
# Avec Docker Compose
docker exec backend npm run seed:admin

# En local
cd backend && npm run seed:admin
```

---

## Configuration

### Variables d'environnement

```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

**`.env` (racine)**

```env
JWT_SECRET=change_this_secret
VITE_API_URL=http://localhost:5000/api
```

**`backend/.env`**

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/filrouge
JWT_SECRET=change_this_secret
```

---

## Commandes utiles

### Docker Compose

```bash
docker compose up --build          # Lancer et construire
docker compose up -d               # Lancer en arrière-plan
docker compose logs -f backend     # Logs backend en temps réel
docker compose down -v             # Arrêter et supprimer les volumes
```

### Kubernetes

```bash
kubectl get all -n devops-portfolio                              # Vue complète
kubectl get pods -n devops-portfolio -w                         # Surveillance temps réel
kubectl logs -n devops-portfolio deployment/backend-deployment  # Logs backend
kubectl rollout restart deployment/backend-deployment -n devops-portfolio
kubectl port-forward service/frontend-service 3000:80 -n devops-portfolio
```

### Infrastructure locale (après redémarrage)

```bash
docker start jenkins                                                    # Démarrer Jenkins
docker compose -f docker-compose.sonar.yml up -d                       # Démarrer SonarQube
ngrok http --domain=nuclei-mosaic-ecard.ngrok-free.app 8080            # Tunnel GitHub webhook
kubectl get pods -n devops-portfolio                                    # Vérifier K8s
```

---

## Roadmap DevOps

| Module | Technologie | Statut |
|--------|-------------|--------|
| 1 | Docker + Docker Compose | ✅ Complété |
| 2 | Jenkins — Pipeline CI/CD | ✅ Complété |
| 3 | SonarQube + Tests Jest | ✅ Complété |
| 4 | Kubernetes | ✅ Complété |
| 5 | Terraform — Infrastructure as Code | 🔜 À venir |
| 6 | Prometheus / Grafana — Monitoring | 🔜 À venir |
| 7 | Trivy — Scan de sécurité | 🔜 À venir |
| 8 | Outils IA pour DevOps | 🔜 À venir |

---

## Auteur

**Seydina Limamou Laye Yade**  
Formation Cloud AWS & DevOps — Orange Digital Center (ODC)  
[GitHub](https://github.com/seydinalimamoulayeyade) · [Docker Hub](https://hub.docker.com/u/lims4) · [LinkedIn](https://linkedin.com/in/seydinalimamoulayeyade)

---

## Licence

MIT