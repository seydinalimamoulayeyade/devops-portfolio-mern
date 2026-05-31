const request = require("supertest");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

process.env.JWT_SECRET = "test-secret-jest";

// ── App minimale avec routes auth ─────────────────────────────────────────────
function buildApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  const authRoutes = require("../routes/authRoutes");
  app.use("/api/auth", authRoutes);
  return app;
}

// ── Setup / Teardown ──────────────────────────────────────────────────────────
let mongod;
let app;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  app = buildApp();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

// ── Helper — crée un user en base ────────────────────────────────────────────
async function createUser({ email, password, role = "user" }) {
  const User = require("../models/User");
  const hashed = await bcrypt.hash(password, 10);
  return User.create({ email, password: hashed, role });
}

// ── Tests POST /api/auth/login ────────────────────────────────────────────────

describe("POST /api/auth/login — avec MongoDB connecté", () => {
  test("retourne 400 si email et password manquants", async () => {
    const res = await request(app).post("/api/auth/login").send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/requis/i);
  });

  test("retourne 400 si utilisateur non trouvé", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "inconnu@test.com", password: "password" });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalide/i);
  });

  test("retourne 400 si mot de passe incorrect", async () => {
    await createUser({ email: "user@test.com", password: "correct" });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "user@test.com", password: "mauvais" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalide/i);
  });

  test("retourne 200 avec token si credentials valides — rôle user", async () => {
    await createUser({
      email: "user@test.com",
      password: "secret123",
      role: "user",
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "user@test.com", password: "secret123" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe("user@test.com");
    expect(res.body.user.role).toBe("user");

    // Vérifie que le token JWT est valide et contient les bons champs
    const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(decoded.id).toBeDefined();
    expect(decoded.role).toBe("user");
  });

  test("retourne 200 avec token si credentials valides — rôle admin", async () => {
    await createUser({
      email: "admin@test.com",
      password: "admin123",
      role: "admin",
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@test.com", password: "admin123" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.role).toBe("admin");

    const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(decoded.role).toBe("admin");
  });

  test("le token expire dans 1 jour", async () => {
    await createUser({ email: "user@test.com", password: "secret123" });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "user@test.com", password: "secret123" });

    const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
    const expiresIn = decoded.exp - decoded.iat;
    // 1 jour = 86400 secondes
    expect(expiresIn).toBe(86400);
  });
});
