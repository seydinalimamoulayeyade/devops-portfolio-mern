const request = require("supertest");
const express = require("express");
const { register, metricsMiddleware } = require("../middleware/metrics");

// Petite app de test : le middleware + une route + l'endpoint /metrics,
// reproduisant le câblage de server.js.
function buildApp() {
  const app = express();
  app.use(metricsMiddleware);

  app.get("/ping", (req, res) => {
    res.status(200).json({ pong: true });
  });

  app.get("/metrics", async (req, res) => {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  });

  return app;
}

let app;

beforeAll(() => {
  app = buildApp();
});

// ── GET /metrics ────────────────────────────────────────────────────────────

describe("GET /metrics", () => {
  test("expose les métriques par défaut du process Node", async () => {
    const res = await request(app).get("/metrics");
    expect(res.status).toBe(200);
    // Métrique automatique de prom-client (collectDefaultMetrics)
    expect(res.text).toContain("process_cpu_seconds_total");
    // Notre étiquette commune
    expect(res.text).toContain('app="devops-portfolio-backend"');
  });

  test("le Content-Type est au format Prometheus (text/plain)", async () => {
    const res = await request(app).get("/metrics");
    expect(res.headers["content-type"]).toMatch(/text\/plain/);
  });
});

// ── Le middleware mesure les requêtes ─────────────────────────────────────────

describe("metricsMiddleware", () => {
  test("incrémente http_requests_total après une requête", async () => {
    // On déclenche une requête mesurée
    await request(app).get("/ping");

    // Puis on relit /metrics : la métrique doit apparaître avec les bons labels
    const res = await request(app).get("/metrics");
    expect(res.text).toContain("http_requests_total");
    expect(res.text).toMatch(/http_requests_total\{[^}]*route="\/ping"/);
    expect(res.text).toMatch(/status_code="200"/);
  });

  test("enregistre la durée via http_request_duration_seconds", async () => {
    await request(app).get("/ping");
    const res = await request(app).get("/metrics");
    expect(res.text).toContain("http_request_duration_seconds");
  });
});
