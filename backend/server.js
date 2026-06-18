require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const projectRoutes = require('./src/routes/projectRoutes');
const authRoutes = require('./src/routes/authRoutes');
const { register, metricsMiddleware } = require('./src/middleware/metrics');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mesure de toutes les requêtes pour Prometheus (placé tôt pour tout capter)
app.use(metricsMiddleware);

// Serve uploads
app.use('/uploads', express.static('uploads'));

// DB connection
connectDB();

// Routes
app.use('/api/projets', projectRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('API backend fonctionnelle 🚀');
});

// Endpoint de santé pour les vérifications de disponibilité
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Endpoint de métriques scrappé par Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
