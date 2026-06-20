// src/middleware/metrics.js
// Instrumentation Prometheus du backend Express via prom-client.

const client = require('prom-client');

// ── 1. Le "registre" : le carnet qui regroupe toutes nos métriques ──────────
const register = new client.Registry();

// Étiquette commune ajoutée à toutes les métriques (utile pour filtrer dans Prometheus)
register.setDefaultLabels({ app: 'devops-portfolio-backend' });

// ── 2. Métriques automatiques du process Node ───────────────────────────────
// CPU, mémoire, garbage collector, boucle d'événements, etc.
client.collectDefaultMetrics({ register });

// ── 3. Métriques HTTP métier (méthode RED) ──────────────────────────────────
// Un histogram mesure la RÉPARTITION des durées (combien de requêtes < 100ms, etc.)
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Durée des requêtes HTTP en secondes',
  // labelNames : les "étiquettes" qui découperont la métrique en séries
  labelNames: ['method', 'route', 'status_code'],
  // buckets : les paliers de durée mesurés (en secondes)
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
});
register.registerMetric(httpRequestDuration);

// Un counter compte le nombre total de requêtes (ne fait qu'augmenter)
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Nombre total de requêtes HTTP',
  labelNames: ['method', 'route', 'status_code'],
});
register.registerMetric(httpRequestsTotal);

// ── Métriques MÉTIER (spécifiques à l'application) ──────────────────────────
// Tentatives de connexion, ventilées par résultat (success / failure).
const loginAttempts = new client.Counter({
  name: 'auth_login_attempts_total',
  help: 'Nombre de tentatives de connexion par résultat',
  labelNames: ['result'],
});
register.registerMetric(loginAttempts);

// Nombre de projets créés via l'API.
const projectsCreated = new client.Counter({
  name: 'projects_created_total',
  help: 'Nombre total de projets créés',
});
register.registerMetric(projectsCreated);

// Nombre RÉEL de projets en base (jauge : monte ET descend).
// Différence avec le compteur ci-dessus : le compteur ne fait qu'augmenter et
// repart à zéro si le pod redémarre ; la jauge reflète l'état réel de la base.
// Le hook `collect()` est appelé par prom-client à CHAQUE scrape Prometheus :
// on y interroge MongoDB (countDocuments) pour rafraîchir la valeur.
const Project = require('../models/Project');
const mongoose = require('mongoose');

const projectsCount = new client.Gauge({
  name: 'portfolio_projects_count',
  help: 'Nombre actuel de projets stockés en base',
  async collect() {
    // mongoose.connection.readyState === 1 → connexion établie.
    // On évite d'interroger la base si elle n'est pas prête (sinon erreur au scrape).
    if (mongoose.connection.readyState !== 1) return;
    try {
      const count = await Project.countDocuments();
      this.set(count);
    } catch (err) {
      // En cas d'erreur DB, on n'actualise pas la jauge (garde la dernière valeur).
    }
  },
});
register.registerMetric(projectsCount);

// ── 4. Le middleware : mesure CHAQUE requête qui traverse l'app ──────────────
function metricsMiddleware(req, res, next) {
  // On démarre un chrono à l'entrée de la requête
  const end = httpRequestDuration.startTimer();

  // res.on('finish') : se déclenche quand la réponse est entièrement envoyée
  res.on('finish', () => {
    // req.route?.path = le motif de la route (ex. "/:id") plutôt que l'URL exacte,
    // pour éviter de créer une série différente par identifiant (explosion de cardinalité).
    const route = req.route ? req.baseUrl + req.route.path : req.path;
    const labels = {
      method: req.method,
      route,
      status_code: res.statusCode,
    };

    // On arrête le chrono (enregistre la durée) et on incrémente le compteur
    end(labels);
    httpRequestsTotal.inc(labels);
  });

  next();
}

module.exports = { register, metricsMiddleware, loginAttempts, projectsCreated, projectsCount };
