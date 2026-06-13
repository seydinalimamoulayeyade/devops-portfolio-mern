# Documentation du Projet

## 📚 Structure de la Documentation

### Documents Publics (Dans `/docs`)

Ces fichiers sont versionnés et accessibles publiquement sur GitHub :

| Fichier | Description | Audience |
|---------|-------------|----------|
| **01-DOCKER.md** | Guide Docker et conteneurisation | Développeurs |
| **02-JENKINS.md** | Configuration et pipeline CI/CD | DevOps |
| **03-SONARQUBE.md** | Qualité de code et analyses | Développeurs |
| **04-KUBERNETES.md** | Orchestration et déploiement | DevOps |
| **05-TERRAFORM.md** | Infrastructure as Code | DevOps |
| **06-UI-MODERNE.md** | Design system et composants UI | Frontend Dev |
| **TERRAFORM_GUIDE.md** | Guide pratique Terraform | DevOps |

**✅ À garder** : Documentation technique, guides d'utilisation, architecture

### Documents Privés (Racine du projet)

Ces fichiers sont **exclus** du repository (via `.gitignore`) :

| Fichier | Description | Raison de l'exclusion |
|---------|-------------|----------------------|
| **SONAR_QUALITY_REPORT.md** | Rapport d'analyse qualité | Temporaire, spécifique à un build |
| **UI_REFONTE_COMPLETE.md** | Récapitulatif refonte UI | Document de travail interne |
| **BUILD_RESULTS*.md** | Résultats de builds | Données éphémères |
| **TEST_RESULTS*.md** | Résultats de tests | Données éphémères |

**❌ À exclure** : Rapports temporaires, analyses de build, documents de travail

### Scripts (Dans `/scripts`)

| Type | Description | Exposition |
|------|-------------|------------|
| **\*.ps1** | Scripts PowerShell | ❌ Privés (chemins locaux, configs) |
| **\*.md** | Guides markdown | ✅ Publics (instructions génériques) |
| **\*.js** | Scripts Node.js | ✅ Publics (seedAdmin.js) |

**Stratégie** : 
- Scripts PowerShell contiennent des chemins locaux → privés
- Guides markdown sont génériques → publics

## 🎯 Bonnes Pratiques

### Ce qui DOIT être versionné

✅ **Documentation technique**
- Architecture du projet
- Guides d'installation
- Configuration des outils DevOps
- Design system et composants
- APIs et interfaces

✅ **Configuration**
- Fichiers Docker (Dockerfile, docker-compose.yml)
- Configuration CI/CD (Jenkinsfile)
- Configuration Kubernetes (manifests)
- Configuration Terraform (modules)
- Configuration SonarQube (sonar-project.properties)

✅ **Code source**
- Backend (Node.js/Express)
- Frontend (React/Vite)
- Tests unitaires
- Scripts de seeding

### Ce qui NE DOIT PAS être versionné

❌ **Données sensibles**
- Fichiers `.env` avec secrets
- Tokens d'authentification
- Credentials Docker Hub / AWS
- Mots de passe

❌ **Fichiers temporaires**
- Rapports de build
- Résultats de tests
- Analyses de qualité ponctuelles
- Fichiers de travail personnel

❌ **Fichiers générés**
- `node_modules/`
- `dist/` et `build/`
- Coverage reports
- `.scannerwork/`

❌ **Fichiers locaux**
- Configuration IDE personnelle
- Scripts avec chemins absolus
- Logs de développement

## 📂 Organisation Recommandée

```
/
├── docs/                       ✅ Public
│   ├── README.md              → Ce fichier
│   ├── 01-DOCKER.md           → Guide Docker
│   ├── 02-JENKINS.md          → Guide Jenkins
│   ├── 03-SONARQUBE.md        → Guide SonarQube
│   ├── 04-KUBERNETES.md       → Guide Kubernetes
│   ├── 05-TERRAFORM.md        → Guide Terraform
│   ├── 06-UI-MODERNE.md       → Design System
│   └── TERRAFORM_GUIDE.md     → Guide pratique Terraform
│
├── scripts/                    ⚠️ Mixte
│   ├── *.md                   → ✅ Guides (publics)
│   ├── *.ps1                  → ❌ Scripts PowerShell (privés)
│   └── seedAdmin.js           → ✅ Script Node (public)
│
├── DESIGN_SYSTEM.md           ✅ Public (design)
├── README.md                  ✅ Public (principal)
│
├── SONAR_QUALITY_REPORT.md    ❌ Privé (temporaire)
├── UI_REFONTE_COMPLETE.md     ❌ Privé (temporaire)
└── *_RESULTS.md               ❌ Privés (temporaires)
```

## 🔐 Sécurité

### Informations à NE JAMAIS commiter

❌ **Absolument interdits** :
- Mots de passe en clair
- Tokens API (GitHub, Docker Hub, AWS)
- Clés privées SSH
- Certificats SSL privés
- Credentials de bases de données
- Secrets Kubernetes

⚠️ **À vérifier avant commit** :
- Pas de `console.log` avec données sensibles
- Pas de commentaires avec credentials
- Pas de URLs avec tokens
- Pas de chemins absolus locaux

### Si un secret est committé par erreur

```bash
# 1. NE PAS faire de simple commit de correction
# 2. Révoquer immédiatement le secret
# 3. Utiliser git-filter-repo ou BFG pour nettoyer l'historique
# 4. Force push (attention aux collaborateurs)
```

## 📖 Comment Contribuer à la Documentation

### Ajouter une Nouvelle Page

1. **Créer le fichier dans `/docs`**
   ```bash
   # Suivre la convention de nommage
   docs/XX-NOM-OUTIL.md
   ```

2. **Structure recommandée**
   ```markdown
   # Titre de l'Outil
   
   ## 🎯 Vue d'Ensemble
   ## 📦 Installation
   ## ⚙️ Configuration
   ## 🚀 Utilisation
   ## 🔧 Maintenance
   ## 📚 Ressources
   ```

3. **Commiter**
   ```bash
   git add docs/XX-NOM-OUTIL.md
   git commit -m "docs: ajout guide XX-NOM-OUTIL"
   git push origin main
   ```

### Mettre à Jour une Page

1. Éditer le fichier concerné
2. Vérifier la clarté et les exemples
3. Commiter avec message descriptif

### Créer un Rapport Temporaire

1. **Créer à la racine** (sera ignoré par git)
   ```bash
   # Exemple
   SONAR_BUILD_42_REPORT.md
   ```

2. **Ne pas commiter** (vérifié par `.gitignore`)

3. **Archiver si nécessaire**
   - Copier dans un dossier local hors du repo
   - Ou documenter les métriques dans un wiki interne

## 🎓 Documentation Externe

### Liens Utiles

- **GitHub Repo** : https://github.com/seydinalimamoulayeyade/devops-portfolio-mern
- **Docker Hub** : https://hub.docker.com/u/lims4
- **LinkedIn** : https://linkedin.com/in/seydinalimamoulayeyade

### Support

Pour questions ou suggestions sur la documentation :
- 📧 Email : seydinalimamoulayeyade@gmail.com
- 🐙 GitHub Issues : https://github.com/seydinalimamoulayeyade/devops-portfolio-mern/issues

## 📝 Changelog Documentation

### Version 2.0 (12 Juin 2026)
- ✅ Ajout 06-UI-MODERNE.md (Design System)
- ✅ Mise à jour TERRAFORM_GUIDE.md
- ✅ Réorganisation structure /docs
- ✅ Ajout .gitignore pour rapports temporaires

### Version 1.0 (Précédent)
- ✅ Documentation initiale (01 à 05)
- ✅ DESIGN_SYSTEM.md
- ✅ README.md principal

---

**Dernière mise à jour** : 12 Juin 2026  
**Mainteneur** : Seydina Limamou Laye Yade  
**Version** : 2.0
