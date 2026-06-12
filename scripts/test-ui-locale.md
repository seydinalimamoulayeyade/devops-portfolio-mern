# Guide de Test UI en Local

## 🚀 Démarrage Rapide

### 1. Démarrer MongoDB (si nécessaire)
```bash
# Avec Docker
docker-compose up -d mongodb

# Ou avec MongoDB local
mongod
```

### 2. Démarrer le Backend
```bash
cd backend
npm run dev
```
**Attendu** : Backend démarre sur http://localhost:5000

### 3. Démarrer le Frontend
```bash
cd frontend
npm run dev
```
**Attendu** : Frontend démarre sur http://localhost:5173

## ✅ Checklist de Test

### Page d'Accueil (/)
- [ ] Hero section s'affiche avec gradient purple/cyan/emerald
- [ ] Titre "Je conçois, automatise et déploie..." visible
- [ ] Section About Me avec 4 cards animées (Mission, Focus, Learning, Goal)
- [ ] Section Skills avec barres de compétences
- [ ] Section Pipeline CI/CD avec 7 stages
- [ ] Section Projets Featured (3 projets)
- [ ] Section CTA avec gradient background
- [ ] Footer moderne s'affiche en bas

### Liste des Projets (/projets)
- [ ] Header avec titre et statistiques
- [ ] Barre de recherche fonctionne
- [ ] Cards projets s'affichent avec images
- [ ] Bouton "Ajouter un projet" visible si admin
- [ ] Hover effects sur les cards

### Détails Projet (/projets/:id)
- [ ] Image du projet en grand format
- [ ] Titre et badges de synthèse
- [ ] Description complète
- [ ] Liste des technologies avec badges purple
- [ ] Boutons GitHub et Demo (si disponibles)
- [ ] Bouton retour vers la liste

### Page Login (/login)
- [ ] Layout 2 colonnes
- [ ] Côté gauche avec infos et badges
- [ ] Formulaire de connexion avec inputs glassmorphism
- [ ] Bouton "Ouvrir la console" avec gradient
- [ ] Lien vers projets publics

### Page Ajouter/Modifier Projet (/ajouter)
⚠️ **Nécessite d'être authentifié comme admin**

- [ ] Formulaire avec tous les champs
- [ ] Upload d'image avec preview
- [ ] Sidebar avec étapes de publication
- [ ] Badge "Conseil DevOps" en emerald
- [ ] Bouton submit avec gradient purple-to-pink

## 🎨 Vérifications Visuelles

### Couleurs
- [ ] Purple (`#8b5cf6`) pour les bordures et accents principaux
- [ ] Cyan (`#06b6d4`) pour les badges techniques
- [ ] Emerald (`#10b981`) pour les status success
- [ ] Pink (`#ec4899`) dans les gradients

### Effets Glassmorphism
- [ ] Cards avec `backdrop-blur` visible
- [ ] Bordures semi-transparentes
- [ ] Ombres douces purple/cyan

### Animations
- [ ] Fade-in des sections au scroll
- [ ] Hover effects sur les boutons (scale up)
- [ ] Hover effects sur les cards (lift up)
- [ ] Transitions fluides (300ms)
- [ ] Status dots avec ping animation

### Responsive
- [ ] Mobile (< 640px) : Layout vertical, textes adaptés
- [ ] Tablet (768px) : 2 colonnes pour les grids
- [ ] Desktop (1024px+) : Layout complet avec sidebars

## 🐛 Tests Fonctionnels

### Navigation
- [ ] Liens navbar fonctionnent
- [ ] Boutons CTA redirigent correctement
- [ ] Liens footer fonctionnent
- [ ] Navigation entre pages sans reload

### Authentification
1. Aller sur `/login`
2. Entrer : `admin@test.com` / `admin123`
3. Cliquer "Ouvrir la console"
4. [ ] Redirection vers `/projets`
5. [ ] Bouton "Ajouter un projet" visible

### CRUD Projets (Admin)
1. Se connecter comme admin
2. Cliquer "Ajouter un projet"
3. Remplir le formulaire
4. Upload une image
5. Cliquer "Ajouter le projet"
6. [ ] Redirection vers liste
7. [ ] Nouveau projet visible

### Recherche
1. Aller sur `/projets`
2. Entrer "Docker" dans la recherche
3. [ ] Projets filtrés correctement
4. [ ] Compteur mis à jour

## 🔍 Tests Browser

### Chrome/Edge
- [ ] Tous les styles s'appliquent
- [ ] Glassmorphism fonctionne
- [ ] Animations fluides

### Firefox
- [ ] Styles identiques
- [ ] Backdrop-blur supporté

### Safari (si disponible)
- [ ] Compatibilité webkit
- [ ] Prefixes CSS appliqués

## 📱 Tests Mobile

### Viewport Mobile (375px)
- [ ] Textes lisibles
- [ ] Boutons cliquables
- [ ] Navigation accessible
- [ ] Cards en colonne unique

### Orientation Paysage
- [ ] Layout adapté
- [ ] Pas de débordement horizontal

## 🚨 Problèmes Connus

### Si les styles ne s'appliquent pas
1. Vérifier que Tailwind compile : `npm run dev`
2. Vérifier `index.css` importé dans `main.jsx`
3. Vider le cache du navigateur (Ctrl + Shift + R)

### Si le backend ne répond pas
1. Vérifier MongoDB démarre : `docker ps` ou `mongod`
2. Vérifier le port 5000 est libre
3. Vérifier `.env` dans backend existe

### Si les images ne chargent pas
1. Vérifier le dossier `backend/uploads/` existe
2. Vérifier les permissions du dossier
3. Vérifier CORS configuré dans backend

## ✨ Capture d'Écran Recommandée

Prendre des screenshots de :
1. Page d'accueil complète (scroll)
2. Liste des projets
3. Détails d'un projet
4. Formulaire d'ajout
5. Page login

## 🎯 Critères de Succès

### Must Have ✅
- [x] Nouveau design system appliqué partout
- [x] Footer intégré dans Layout
- [x] NewHomePage fonctionne
- [x] Toutes les pages modernisées
- [x] Animations fluides
- [x] Navigation fonctionne

### Nice to Have 🎨
- [ ] Animations micro-interactions supplémentaires
- [ ] Loading states élaborés
- [ ] Toast notifications
- [ ] Page 404 personnalisée

---

**Après les tests réussis** :
1. Créer un commit si corrections nécessaires
2. Push vers GitHub
3. Trigger un build Jenkins
4. Vérifier le déploiement K8s

**En cas de problème** :
- Consulter la console browser (F12)
- Vérifier les logs backend
- Vérifier les warnings Tailwind
