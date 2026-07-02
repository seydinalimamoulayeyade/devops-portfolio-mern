# devops-portfolio-mern

> Application fullstack **MERN** servant de **fil rouge** à la formation Cloud & DevOps (Orange Digital Center).
> Chaque étape ajoute une couche au même projet : Docker → CI/CD → Qualité → Kubernetes → IaC → Monitoring.

![Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?style=flat-square&logo=react)
![Docker](https://img.shields.io/badge/Docker-Containerisé-2496ED?style=flat-square&logo=docker)
![Jenkins](https://img.shields.io/badge/Jenkins-CI%2FCD-D24939?style=flat-square&logo=jenkins)
![SonarQube](https://img.shields.io/badge/SonarQube-Quality%20Gate-4E9BCD?style=flat-square&logo=sonarqube)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Déployé-326CE5?style=flat-square&logo=kubernetes)
![Terraform](https://img.shields.io/badge/Terraform-IaC-7B42BC?style=flat-square&logo=terraform)
![Prometheus](https://img.shields.io/badge/Prometheus%2FGrafana-Monitoring-E6522C?style=flat-square&logo=prometheus)

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 19 + Vite + Tailwind v4 (servi par Nginx) |
| Backend | Node.js 22 + Express + JWT |
| Base de données | MongoDB 7 + Mongoose |
| Conteneurisation | Docker + Docker Compose |
| CI/CD | Jenkins (pipeline 7 stages) |
| Qualité | SonarQube 10.7 + Quality Gate |
| Sécurité | Trivy (vuln · secret · misconfig · license) |
| Tests | Jest + Supertest + mongodb-memory-server |
| Orchestration | Kubernetes |
| IaC | Terraform (modules + envs dev/prod) |
| Observabilité | Prometheus, Alertmanager, Grafana, exporters |

## Pipeline CI/CD

Chaque `git push` sur `main` déclenche le pipeline Jenkins :

```
Checkout → Backend Tests → Trivy (Repo & IaC) → SonarQube → Quality Gate
  → Build Images → Trivy (Image Scan) → Push Images → Terraform Validation → Deploy K8s
```

> Sécurité **shift-left** : Trivy scanne le code et l'IaC avant le build, puis les
> images avant le push (une CVE **CRITICAL** corrigeable bloque la publication).

Le déploiement réel est géré par **Terraform** ; le stage Deploy rafraîchit les images via `kubectl rollout`.

## Démarrage rapide

**Docker Compose (dev local) :**
```bash
git clone https://github.com/seydinalimamoulayeyade/devops-portfolio-mern.git
cd devops-portfolio-mern
cp .env.example .env && cp backend/.env.example backend/.env
docker compose up --build
# Frontend http://localhost · API http://localhost:5000/api
```

**Kubernetes via Terraform (déploiement industrialisé) :**
```bash
cd terraform/environments/dev
cp terraform.tfvars.example terraform.tfvars   # renseigner les secrets
terraform init && terraform apply
```

> Variante manuelle (pédagogique, étape 04) : voir [`k8s/README.md`](k8s/README.md).

## Structure

```
backend/      API Express (tests, /metrics)
frontend/     React + Vite + Nginx
k8s/          Manifests K8s manuels — étape 04 (référence)
terraform/    IaC — étape 05 (source de vérité du déploiement)
monitoring/   Prometheus, Alertmanager, Grafana, exporters
docs/         Documentation PDF (1 par étape)
scripts/      Utilitaires
Jenkinsfile · docker-compose*.yml · sonar-project.properties · trivy.yaml · .trivyignore
```

## Documentation

Un PDF par étape du fil rouge, dans [`docs/`](docs/) :

`01-DOCKER` · `02-JENKINS` · `03-SONARQUBE` · `04-KUBERNETES` · `05-TERRAFORM` · `06-PROMETHEUS` · `07-GRAFANA`

Étape sécurité (Markdown) : [`08-TRIVY`](docs/08-TRIVY.md) — cibles, scanners, bases de données, formats, workflow et intégration pipeline.

## Roadmap

| # | Étape | Statut |
|---|-------|--------|
| 1 | Docker + Compose | ✅ |
| 2 | Jenkins — CI/CD | ✅ |
| 3 | SonarQube + Tests | ✅ |
| 4 | Kubernetes | ✅ |
| 5 | Terraform — IaC | ✅ |
| 6 | Prometheus / Grafana — Monitoring | ✅ |
| 7 | Trivy — Scan de sécurité | ✅ |
| 8 | Outils IA pour DevOps | 🔜 |

## Images Docker Hub

`lims4/devops-portfolio-mern-backend` · `lims4/devops-portfolio-mern-frontend`

---

**Seydina Limamou Laye Yade** — Formation Cloud AWS & DevOps (ODC)
[GitHub](https://github.com/seydinalimamoulayeyade) · [Docker Hub](https://hub.docker.com/u/lims4) · [LinkedIn](https://linkedin.com/in/seydinalimamoulayeyade) — Licence MIT
