const request = require("supertest");
const express = require("express");
const cors = require("cors");

function buildApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/", (req, res) => {
    res.send("API backend fonctionnelle 🚀");
  });

  app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

  const authRoutes = require("../routes/authRoutes");
  app.use("/api/auth", authRoutes);

  return app;
}

let app;

beforeAll(() => {
  process.env.JWT_SECRET = "test-secret-jest";
  app = buildApp();
});

// ── GET / ─────────────────────────────────────────────────────────────────────

describe("GET /", () => {
  test("retourne 200 avec le message de bienvenue", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toContain("API backend fonctionnelle");
  });
});

// ── GET /api/health ───────────────────────────────────────────────────────────

describe("GET /api/health", () => {
  test('retourne 200 avec { status: "ok" }', async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  test("Content-Type est application/json", async () => {
    const res = await request(app).get("/api/health");
    expect(res.headers["content-type"]).toMatch(/application\/json/);
  });
});

// ── POST /api/auth/register ───────────────────────────────────────────────────

describe("POST /api/auth/register", () => {
  test("retourne 403 — inscription publique désactivée", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "test@test.com", password: "123456" });
    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/desactivee/i);
  });
});

// ── POST /api/auth/login ──────────────────────────────────────────────────────
// Sans MongoDB connecté, le try/catch retourne proprement 500

describe("POST /api/auth/login", () => {
  test("retourne 400 si body vide — champs requis manquants", async () => {
    const res = await request(app).post("/api/auth/login").send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/requis/i);
  });

  test("retourne 500 si MongoDB non connecté", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@test.com", password: "password" });
    expect(res.status).toBe(500);
    expect(res.body.message).toMatch(/erreur serveur/i);
  }, 15000); // timeout étendu — Mongoose attend ~10s avant de rejeter
});
