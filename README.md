# devops-portfolio-mern

> Application fullstack MERN containerisée — fil rouge de la formation Cloud & DevOps à l'Orange Digital Center (ODC).

![Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?style=flat-square&logo=react)
![Docker](https://img.shields.io/badge/Docker-Containerisé-2496ED?style=flat-square&logo=docker)
![Docker Hub](https://img.shields.io/badge/Docker%20Hub-lims4-2496ED?style=flat-square&logo=docker)
![License](https://img.shields.io/badge/Licence-MIT-green?style=flat-square)

---

## Présentation

**devops-portfolio-mern** est une application de gestion de portfolio technique, conçue pour servir de projet fil rouge tout au long de la formation DevOps. Chaque module de la formation ajoute une couche concrète au même projet — de la containerisation Docker jusqu'au monitoring Prometheus/Grafana, en passant par Jenkins, Kubernetes et Terraform.

### Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Base de données | MongoDB + Mongoose |
| Auth | JWT (JSON Web Tokens) |
| Upload | Multer (stockage local) |
| Containerisation | Docker + Docker Compose |

---

## Images Docker Hub

Les images sont publiées et disponibles publiquement :

| Service | Image | Taille |
|---------|-------|--------|
| Frontend | `docker pull lims4/devops-portfolio-mern-frontend:latest` | ~26 MB |
| Backend | `docker pull lims4/devops-portfolio-mern-backend:latest` | ~65 MB |

> Le frontend utilise un **multi-stage build** (Node.js → Nginx alpine) — l'image finale ne contient que les fichiers statiques compilés, sans Node.js ni dépendances de développement.

---

## Structure du projet

```
devops-portfolio-mern/
├── frontend/                   # Application React (Vite)
│   ├── src/
│   │   ├── components/         # Composants UI réutilisables
│   │   ├── pages/              # Vues / routes
│   │   ├── context/            # État global (AuthContext)
│   │   ├── services/           # Appels API (axios)
│   │   └── hooks/              # Custom hooks
│   ├── public/
│   ├── .dockerignore
│   ├── Dockerfile              # Multi-stage build (Node.js → Nginx)
│   └── package.json
├── backend/                    # API Node.js / Express
│   ├── src/
│   │   ├── config/             # Connexion MongoDB
│   │   ├── controllers/        # Logique métier
│   │   ├── middleware/         # Auth, upload, erreurs
│   │   ├── models/             # Schémas Mongoose
│   │   ├── routes/             # Endpoints REST
│   │   └── utils/              # Fonctions helpers
│   ├── uploads/                # Images uploadées (non versionné)
│   ├── .dockerignore
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## Démarrage rapide

### Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé et lancé
- Git

### Option 1 — Depuis Docker Hub (sans cloner le repo)

```bash
docker pull lims4/devops-portfolio-mern-frontend:latest
docker pull lims4/devops-portfolio-mern-backend:latest
```

### Option 2 — Depuis le code source

```bash
git clone https://github.com/seydinalimamoulayeyade/devops-portfolio-mern.git
cd devops-portfolio-mern
cp backend/.env.example backend/.env
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost |
| Backend API | http://localhost:5000/api |
| MongoDB | mongodb://localhost:27017 |

---

## Configuration

### Variables d'environnement

Copie les fichiers d'exemple et renseigne les valeurs :

```bash
cp backend/.env.example backend/.env
```

**`backend/.env`**

```env
PORT=5000
MONGO_URI=mongodb://mongo:27017/filrouge
JWT_SECRET=change_this_secret
```

**`.env` (racine)**

```env
JWT_SECRET=change_this_secret
VITE_API_URL=http://localhost:5000/api
```

> En environnement Docker Compose, `mongo` est résolu par le DNS interne du réseau `mern-network` — ne pas remplacer par `localhost`.

---

## Architecture Docker

```
                    ┌─────────────────────────────────────┐
                    │         mern-network (bridge)        │
                    │                                      │
Navigateur :80 ───► │  frontend (Nginx)                    │
                    │       │                              │
                    │       ▼                              │
                    │  backend (Express :5000)             │
                    │       │                              │
                    │       ▼                              │
                    │  mongo (MongoDB :27017)              │
                    └─────────────────────────────────────┘
```

Les 3 services communiquent via le réseau bridge `mern-network`. Chaque service est accessible par son nom (DNS interne Docker). Le frontend est servi par **Nginx** sur le port `80`.

---

## Lancement sans Docker

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

> MongoDB doit tourner localement sur le port `27017`.

---

## API REST

### Projets

```
GET    /api/projets          Liste tous les projets
GET    /api/projets/:id      Détail d'un projet
POST   /api/projets          Créer un projet (auth requise)
PUT    /api/projets/:id      Modifier un projet (auth requise)
DELETE /api/projets/:id      Supprimer un projet (auth requise)
```

### Authentification

```
POST   /api/auth/register    Créer un compte
POST   /api/auth/login       Connexion — retourne un token JWT
```

### Health Check

```
GET    /api/health           Statut du serveur → { "status": "ok" }
```

---

## Commandes Docker utiles

```bash
# Lancer tous les services (rebuild des images)
docker compose up --build

# Lancer en arrière-plan
docker compose up -d

# Voir les conteneurs et leur statut healthy
docker ps

# Logs en temps réel
docker compose logs -f

# Logs d'un service spécifique
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mongo

# Entrer dans un conteneur
docker exec -it backend sh
docker exec -it frontend sh

# Accéder à MongoDB
docker exec -it mongo mongosh

# Inspecter le réseau Docker
docker network inspect devops-portfolio-mern_mern-network

# Arrêter les services
docker compose down

# Arrêter et supprimer les volumes (repart de zéro)
docker compose down -v

# Nettoyer les images et le cache
docker system prune -f
```

---

## Volumes Docker

```yaml
./backend/uploads:/app/uploads   # Bind mount — images persistées sur la machine hôte
mongo_data:/data/db              # Volume Docker — données MongoDB persistées
```

---

## Roadmap DevOps

Ce projet évolue module par module tout au long de la formation :

| Module | Technologie | Statut |
|--------|-------------|--------|
| 1 | DevOps intro — Git flow, branching, README | ✅ Fait |
| 2 | Docker — Dockerfile, Docker Compose, Docker Hub | ✅ Fait |
| 3 | Jenkins — Pipeline CI/CD | 🔜 À venir |
| 4 | SonarQube — Qualité du code | 🔜 À venir |
| 5 | Kubernetes — Orchestration | 🔜 À venir |
| 6 | Terraform — Infrastructure as Code | 🔜 À venir |
| 7 | Prometheus / Grafana — Monitoring | 🔜 À venir |
| 8 | Trivy — Scan de sécurité | 🔜 À venir |
| 9 | Outils IA pour DevOps | 🔜 À venir |

---

## Auteur

**Seydina Lima Mamoulaye Yade**
Formation Cloud AWS & DevOps — Orange Digital Center (ODC)
[GitHub](https://github.com/seydinalimamoulayeyade) · [Docker Hub](https://hub.docker.com/u/lims4)

---

## Licence

MIT