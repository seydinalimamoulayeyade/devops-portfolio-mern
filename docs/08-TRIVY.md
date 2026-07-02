# Étape 07 — Trivy : sécurité (DevSecOps)

> Scan de sécurité intégré au pipeline. Trivy est un scanner **open source** (Aqua
> Security) tout-en-un : vulnérabilités, mauvaises configurations, secrets et licences,
> sur des cibles variées (images, code, IaC, Kubernetes…).

---

## 1. Pourquoi Trivy dans le fil rouge

La CI/CD produit et déploie des images. Sans contrôle, on peut publier une image
contenant une CVE critique, un secret en clair, ou déployer une config Kubernetes
non durcie. Trivy applique le principe **shift-left** : détecter tôt, échouer vite,
avant que le problème n'atteigne la production.

Dans ce projet, Trivy intervient à **deux moments** du pipeline :

1. **Repo & IaC** (avant le build) — analyse le code source et les fichiers
   d'infrastructure.
2. **Image Scan** (après le build, avant le push) — analyse les images Docker ;
   une vulnérabilité **CRITICAL** corrigeable **bloque la publication**.

---

## 2. Les CIBLES (targets)

Trivy sait analyser de nombreux types de cibles. Sous-commande = type de cible.

| Cible | Sous-commande | Usage dans ce projet |
|-------|---------------|----------------------|
| **Container Image** | `trivy image <img>` | Images `backend` et `frontend` (avant push) |
| **Filesystem** | `trivy fs <dir>` | Dépendances `node_modules`, code, `package-lock.json` |
| **Code Repository** | `trivy repo <url>` | Scan d'un dépôt Git distant (non utilisé ici, `fs` suffit) |
| **Configuration / IaC** | `trivy config <dir>` | `Dockerfile`, manifests **Kubernetes** (`k8s/`), **Terraform** (`terraform/`) |
| **Kubernetes (cluster)** | `trivy k8s` | Scan d'un cluster live (ressources + workloads) |
| **SBOM** | `trivy sbom <file>` | Analyse d'un SBOM CycloneDX/SPDX existant |
| **VM Image** | `trivy vm` | Images de VM / AMI (hors périmètre) |

> Ici on utilise **`image`**, **`fs`** et **`config`**. `config` détecte
> automatiquement Dockerfile, Terraform (HCL/plan), Kubernetes (YAML), Helm,
> CloudFormation, ARM…

---

## 3. Les SCANNERS

Un scanner = un type de problème recherché. On les active via `--scanners`.

| Scanner | Détecte | Exemples |
|---------|---------|----------|
| **vuln** | Vulnérabilités connues (CVE) | Paquets OS (apk/apt) + dépendances applicatives (npm, pip…) |
| **misconfig** | Mauvaises configurations IaC | `USER root`, capabilities, `latest`, absence de `resources.limits` |
| **secret** | Secrets en clair | Clés AWS/GCP, tokens, mots de passe, clés privées, JWT |
| **license** | Licences des dépendances | GPL, AGPL… (risque de conformité) |

Correspondance cible → scanners pertinents dans ce projet :

- `trivy image`  → `vuln,secret`
- `trivy fs`     → `vuln,secret,misconfig,license`
- `trivy config` → `misconfig` (implicite)

---

## 4. Les BASES DE DONNÉES de Trivy

Trivy compare la cible à des bases de données téléchargées puis mises en cache
(`~/.cache/trivy` ; dans notre CI : volume Docker `trivy-cache`).

| Base | Contenu | Distribution |
|------|---------|--------------|
| **Vulnerability DB** (`trivy-db`) | CVE agrégées (NVD, GHSA, avis distros Alpine/Debian/RedHat…) | Image OCI `mirror.gcr.io/aquasec/trivy-db` |
| **Java DB** (`trivy-java-db`) | Empreintes d'artefacts Java (Maven) | Image OCI dédiée (chargée à la demande) |
| **Checks / Policies** | Règles de misconfiguration (Rego/OPA, ex-« policy bundle ») | Bundle OCI, embarque aussi des règles intégrées |
| **Règles de secrets** | Signatures de secrets | **Intégrées** au binaire (pas de téléchargement) |

Points clés :
- La DB de vulnérabilités est **mise à jour ~2×/jour** ; Trivy ne la re-télécharge
  que si la version locale est périmée.
- Le **cache** est essentiel en CI (le 1er téléchargement pèse plusieurs centaines
  de Mo) → on monte un volume persistant `trivy-cache`.
- `--skip-db-update` force l'usage du cache (utile en cas de réseau instable) ;
  `--download-db-only` pré-chauffe le cache.
- Trivy fonctionne **sans NVD en direct** : tout passe par ses DB pré-agrégées
  (donc pas de clé API requise, scan hors-ligne possible une fois la DB en cache).

---

## 5. Les FORMATS DE SORTIE

Choisis via `--format` (+ `--output <fichier>`).

| Format | Option | Usage |
|--------|--------|-------|
| **table** | `--format table` (défaut) | Lecture humaine en console / logs CI |
| **json** | `--format json` | Traitement automatisé, archivage |
| **sarif** | `--format sarif` | Intégration GitHub Code Scanning / IDE |
| **cyclonedx** | `--format cyclonedx` | Génération de **SBOM** (inventaire logiciel) |
| **spdx / spdx-json** | `--format spdx-json` | SBOM au standard SPDX |
| **template** | `--format template --template "@/contrib/html.tpl"` | Rapport **HTML** lisible |
| **junit** | `--format template --template "@/contrib/junit.tpl"` | Résultats façon tests (Jenkins JUnit) |
| **github** | `--format github` | Dépendances pour GitHub Dependency Graph |

Dans ce projet on génère : **table** (console), **sarif** (repo), **html** + **json**
(images) — archivés comme artefacts Jenkins (`trivy-reports/`).

---

## 6. Sévérités et stratégie de GATE

Niveaux : `UNKNOWN`, `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`.

Notre politique (équilibre bruit / sécurité) :

| Constat | Comportement |
|---------|--------------|
| **Secret** détecté (repo) | ❌ **Bloquant** (`--exit-code 1`) |
| Vulnérabilité **CRITICAL** corrigeable (image) | ❌ **Bloquant** avant push |
| Vulnérabilité **HIGH** | ⚠️ Rapportée (artefact), non bloquante |
| **Misconfig** IaC | ⚠️ Rapportée (durcissement recommandé) |
| **Licence** à risque | ⚠️ Rapportée |

- `--ignore-unfixed` : on ne bloque pas sur des CVE **sans correctif** disponible
  (on ne peut rien y faire dans l'immédiat) — réduit le bruit et la frustration.
- `--exit-code 1` : c'est ce code retour non nul qui fait **échouer le stage Jenkins**.

---

## 7. WORKFLOW d'un scan Trivy

```
        ┌─────────────┐
        │   Cible     │  image / fs / config / k8s ...
        └──────┬──────┘
               ▼
   1. Détection & analyse
      - OS (Alpine/Debian…) + gestionnaire de paquets
      - manifestes de dépendances (package-lock.json, go.sum…)
      - fichiers IaC (Dockerfile, *.tf, *.yaml)
               ▼
   2. Mise à jour / lecture des BASES (cache ~/.cache/trivy)
      - trivy-db (CVE), checks (misconfig), règles secrets intégrées
               ▼
   3. Corrélation
      - paquets détectés  ✗  base CVE
      - fichiers IaC      ✗  règles misconfig
      - contenu           ✗  signatures de secrets
               ▼
   4. Filtrage
      - --severity HIGH,CRITICAL
      - --ignore-unfixed
      - .trivyignore (exceptions justifiées)
               ▼
   5. Restitution + code retour
      - rapports (table/json/sarif/html)
      - --exit-code 1 si findings bloquants  →  échec du stage CI
```

---

## 8. Intégration dans CE projet

### Fichiers ajoutés
- **`trivy.yaml`** (racine) — config centralisée (sévérité, scanners, timeout, DB).
- **`.trivyignore`** (racine) — exceptions justifiées (vide par défaut).
- **`scripts/trivy-scan.sh`** — scan local complet (repo / iac / image).
- **`Jenkinsfile`** — 2 stages Trivy (voir ci-dessous).

### Pipeline (shift-left)
```
Checkout → Backend Tests → Trivy (Repo & IaC) → SonarQube → Quality Gate
  → Build Images → Trivy (Image Scan) → Push Images → Terraform Validation → Deploy K8s
```
- **Trivy — Repo & IaC** : `fs` (vuln+secret+misconfig+license) + `config` (IaC) ;
  gate **secrets** bloquant. Rapport `repo.sarif` archivé.
- **Trivy — Image Scan** : `image` (vuln+secret) sur backend & frontend ; gate
  **CRITICAL** bloquant **avant** le push. Rapports `image-*.html` archivés.

Le scanner tourne via l'image officielle `aquasec/trivy:0.58.1` avec un volume
`trivy-cache` (DB persistée entre les builds).

---

## 9. Utilisation en local

```bash
# Tout scanner (repo + IaC + images) — nécessite Docker
./scripts/trivy-scan.sh            # ou: all

# Cibles individuelles
./scripts/trivy-scan.sh repo       # filesystem : vuln + secret + misconfig + license
./scripts/trivy-scan.sh iac        # Dockerfile + Terraform + Kubernetes (misconfig)
./scripts/trivy-scan.sh image      # images backend & frontend (doivent être buildées)

# Rapports générés dans trivy-reports/ (gitignoré) : *.json, *.sarif, image-*.html
```

Pré-requis pour `image` : avoir buildé les images localement
(`docker compose build` ou `docker build ./backend`, `./frontend`).

---

## 10. Aide-mémoire (cheat sheet)

```bash
# Image : vulnérabilités + secrets, seulement HIGH/CRITICAL corrigeables
trivy image --scanners vuln,secret --severity HIGH,CRITICAL --ignore-unfixed nginx:alpine

# Filesystem : scan du répertoire courant
trivy fs --scanners vuln,secret,misconfig,license .

# IaC : Terraform / Kubernetes / Dockerfile
trivy config ./terraform
trivy config ./k8s

# Générer un SBOM CycloneDX
trivy image --format cyclonedx --output sbom.json mon-image:tag

# Rapport HTML
trivy image --format template --template "@contrib/html.tpl" -o report.html mon-image:tag

# Faire échouer un pipeline sur CRITICAL
trivy image --severity CRITICAL --exit-code 1 mon-image:tag

# Pré-charger la base (cache)
trivy image --download-db-only
```

---

## 11. Roadmap sécurité (suites possibles)

- Publier les rapports **SARIF** dans GitHub Code Scanning (onglet Security).
- Générer et versionner un **SBOM** (CycloneDX) par release.
- Ajouter `trivy k8s` sur le cluster (scan des workloads déployés).
- Rendre les **misconfigurations** bloquantes après durcissement (limits, non-root…).
- Planifier un scan **nocturne** (les nouvelles CVE apparaissent en continu, même
  sans nouveau build).

---

**Étape 07 — Trivy** · Fil rouge Cloud & DevOps (ODC)
