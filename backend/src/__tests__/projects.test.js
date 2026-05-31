// backend/src/__tests__/projects.test.js
// Tests d'intégration — MongoDB en mémoire via mongodb-memory-server
// On teste tout le cycle CRUD des projets avec authentification JWT

const request = require('supertest');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = 'test-secret-jest';

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Routes projets (authentification + CRUD)
  const projectRoutes = require('../routes/projectRoutes');
  app.use('/api/projets', projectRoutes);

  return app;
}

// Token JWT admin valide pour les tests
function adminToken() {
  return jwt.sign(
    { id: new mongoose.Types.ObjectId().toString(), role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

// Token JWT user simple (non-admin)
function userToken() {
  return jwt.sign(
    { id: new mongoose.Types.ObjectId().toString(), role: 'user' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

// Payload de projet valide pour les tests
function projectPayload(overrides = {}) {
  return {
    libelle: 'Portfolio DevOps MERN',
    description: 'Application full-stack avec Docker et Jenkins',
    technologies: ['React', 'Node.js', 'MongoDB', 'Docker'],
    statut: 'En cours',
    ...overrides,
  };
}

// ── Setup / Teardown ──────────────────────────────────────────────────────────

let mongod;
let app;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
  app = buildApp();
}, 60000);

afterEach(async () => {
  // Nettoie les collections entre chaque test pour l'isolation
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

// ── GET /api/projets ──────────────────────────────────────────────────────────

describe('GET /api/projets', () => {
  test('retourne 200 avec un tableau vide si aucun projet', async () => {
    const res = await request(app).get('/api/projets');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(0);
  });

  test('retourne les projets existants', async () => {
    // Crée d'abord un projet
    const token = adminToken();
    await request(app)
      .post('/api/projets')
      .set('Authorization', `Bearer ${token}`)
      .field('libelle', 'Projet test')
      .field('description', 'Description test');

    const res = await request(app).get('/api/projets');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('ne requiert pas d\'authentification', async () => {
    const res = await request(app).get('/api/projets');
    expect(res.status).toBe(200);
  });
});

// ── POST /api/projets ─────────────────────────────────────────────────────────

describe('POST /api/projets', () => {
  test('crée un projet avec token admin valide', async () => {
    const token = adminToken();
    const res = await request(app)
      .post('/api/projets')
      .set('Authorization', `Bearer ${token}`)
      .field('libelle', 'Portfolio DevOps')
      .field('description', 'Application MERN déployée avec Docker')
      .field('technologies', 'React,Node.js,Docker')
      .field('statut', 'En cours');

    expect(res.status).toBe(201);
    expect(res.body._id).toBeDefined();
    expect(res.body.libelle).toBe('Portfolio DevOps');
    expect(res.body.statut).toBe('En cours');
  });

  test('retourne 401 sans token', async () => {
    const res = await request(app)
      .post('/api/projets')
      .field('libelle', 'Test')
      .field('description', 'Description');
    expect(res.status).toBe(401);
  });

  test('retourne 403 avec token user non-admin', async () => {
    const token = userToken();
    const res = await request(app)
      .post('/api/projets')
      .set('Authorization', `Bearer ${token}`)
      .field('libelle', 'Test')
      .field('description', 'Description');
    expect(res.status).toBe(403);
  });

  test('le statut par défaut est "En cours"', async () => {
    const token = adminToken();
    const res = await request(app)
      .post('/api/projets')
      .set('Authorization', `Bearer ${token}`)
      .field('libelle', 'Projet sans statut')
      .field('description', 'Description');
    expect(res.status).toBe(201);
    expect(res.body.statut).toBe('En cours');
  });

  test('normalise les technologies depuis une chaîne CSV', async () => {
    const token = adminToken();
    const res = await request(app)
      .post('/api/projets')
      .set('Authorization', `Bearer ${token}`)
      .field('libelle', 'Projet CSV')
      .field('description', 'Test')
      .field('technologies', 'React, Node.js, Docker');
    expect(res.status).toBe(201);
    expect(res.body.technologies).toEqual(['React', 'Node.js', 'Docker']);
  });
});

// ── GET /api/projets/:id ──────────────────────────────────────────────────────

describe('GET /api/projets/:id', () => {
  test('retourne un projet par son id', async () => {
    // Crée un projet
    const token = adminToken();
    const created = await request(app)
      .post('/api/projets')
      .set('Authorization', `Bearer ${token}`)
      .field('libelle', 'Projet à récupérer')
      .field('description', 'Description');

    const id = created.body._id;
    const res = await request(app).get(`/api/projets/${id}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(id);
    expect(res.body.libelle).toBe('Projet à récupérer');
  });

  test('retourne 400 si id invalide (non-ObjectId)', async () => {
    const res = await request(app).get('/api/projets/id-invalide');
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalide/i);
  });

  test('retourne 404 si projet inexistant avec id valide', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/projets/${fakeId}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/non trouve/i);
  });
});

// ── PUT /api/projets/:id ──────────────────────────────────────────────────────

describe('PUT /api/projets/:id', () => {
  test('met à jour un projet existant', async () => {
    const token = adminToken();
    const created = await request(app)
      .post('/api/projets')
      .set('Authorization', `Bearer ${token}`)
      .field('libelle', 'Avant')
      .field('description', 'Description initiale');

    const id = created.body._id;
    const res = await request(app)
      .put(`/api/projets/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .field('libelle', 'Après')
      .field('description', 'Description mise à jour')
      .field('statut', 'Terminé');

    expect(res.status).toBe(200);
    expect(res.body.libelle).toBe('Après');
    expect(res.body.statut).toBe('Terminé');
  });

  test('retourne 401 sans token', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .put(`/api/projets/${fakeId}`)
      .field('libelle', 'Test');
    expect(res.status).toBe(401);
  });

  test('retourne 400 si id invalide', async () => {
    const token = adminToken();
    const res = await request(app)
      .put('/api/projets/id-invalide')
      .set('Authorization', `Bearer ${token}`)
      .field('libelle', 'Test')
      .field('description', 'Test');
    expect(res.status).toBe(400);
  });

  test('retourne 404 si projet inexistant', async () => {
    const token = adminToken();
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .put(`/api/projets/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .field('libelle', 'Test')
      .field('description', 'Test');
    expect(res.status).toBe(404);
  });
});

// ── DELETE /api/projets/:id ───────────────────────────────────────────────────

describe('DELETE /api/projets/:id', () => {
  test('supprime un projet existant', async () => {
    const token = adminToken();
    const created = await request(app)
      .post('/api/projets')
      .set('Authorization', `Bearer ${token}`)
      .field('libelle', 'À supprimer')
      .field('description', 'Description');

    const id = created.body._id;
    const res = await request(app)
      .delete(`/api/projets/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/supprime/i);

    // Vérifie que le projet n'existe plus
    const check = await request(app).get(`/api/projets/${id}`);
    expect(check.status).toBe(404);
  });

  test('retourne 401 sans token', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).delete(`/api/projets/${fakeId}`);
    expect(res.status).toBe(401);
  });

  test('retourne 400 si id invalide', async () => {
    const token = adminToken();
    const res = await request(app)
      .delete('/api/projets/id-invalide')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
  });

  test('retourne 404 si projet inexistant', async () => {
    const token = adminToken();
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .delete(`/api/projets/${fakeId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});