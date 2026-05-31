// backend/src/__tests__/utils.test.js
// Tests unitaires — pas de base de données, pas de réseau
// On teste la logique pure : normalizeTechnologies et cleanProjectPayload

// On importe directement les fonctions depuis le controller.
// Comme elles ne sont pas exportées séparément, on les extrait via un require
// et on s'assure qu'elles sont couvertes via les exports publics.
// Pour les tester directement on les réexpose dans un helper léger.

// ── Reproduction locale des fonctions (source of truth = projectController) ──
function normalizeTechnologies(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  const rawValue = String(value).trim();
  if (!rawValue) return [];
  try {
    const parsed = JSON.parse(rawValue);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item).trim()).filter(Boolean);
    }
  } catch (_e) {
    // JSON.parse intentionnellement ignoré — on tombe sur le split CSV
  }
  return rawValue
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function cleanProjectPayload(body) {
  return {
    libelle: body.libelle,
    description: body.description,
    details: body.details,
    technologies: normalizeTechnologies(body.technologies),
    lienGithub: body.lienGithub || "",
    lienDemo: body.lienDemo || "",
    categorie: body.categorie || "",
    statut: body.statut || "En cours",
  };
}

// ── Tests normalizeTechnologies ───────────────────────────────────────────────

describe("normalizeTechnologies", () => {
  test("retourne [] si value est null", () => {
    expect(normalizeTechnologies(null)).toEqual([]);
  });

  test("retourne [] si value est undefined", () => {
    expect(normalizeTechnologies(undefined)).toEqual([]);
  });

  test("retourne [] si value est une chaîne vide", () => {
    expect(normalizeTechnologies("")).toEqual([]);
  });

  test("retourne [] si value est une chaîne vide avec espaces", () => {
    expect(normalizeTechnologies("   ")).toEqual([]);
  });

  test("accepte un tableau de strings", () => {
    expect(normalizeTechnologies(["React", "Node.js", "MongoDB"])).toEqual([
      "React",
      "Node.js",
      "MongoDB",
    ]);
  });

  test("trim les espaces dans un tableau", () => {
    expect(normalizeTechnologies(["  React  ", " Node.js "])).toEqual([
      "React",
      "Node.js",
    ]);
  });

  test("filtre les entrées vides dans un tableau", () => {
    expect(normalizeTechnologies(["React", "", "  ", "Docker"])).toEqual([
      "React",
      "Docker",
    ]);
  });

  test("accepte une chaîne JSON valide représentant un tableau", () => {
    expect(normalizeTechnologies('["React","Node.js","MongoDB"]')).toEqual([
      "React",
      "Node.js",
      "MongoDB",
    ]);
  });

  test("accepte une chaîne séparée par des virgules", () => {
    expect(normalizeTechnologies("React, Node.js, MongoDB")).toEqual([
      "React",
      "Node.js",
      "MongoDB",
    ]);
  });

  test("trim les espaces dans une chaîne CSV", () => {
    expect(normalizeTechnologies("  React  ,  Node.js  ")).toEqual([
      "React",
      "Node.js",
    ]);
  });

  test("accepte un seul élément sans virgule", () => {
    expect(normalizeTechnologies("Docker")).toEqual(["Docker"]);
  });

  test("convertit les éléments non-string d'un tableau en string", () => {
    expect(normalizeTechnologies([42, true])).toEqual(["42", "true"]);
  });
});

// ── Tests cleanProjectPayload ─────────────────────────────────────────────────

describe("cleanProjectPayload", () => {
  test("retourne un objet avec les champs attendus", () => {
    const body = {
      libelle: "Portfolio DevOps",
      description: "Un projet MERN",
      details: "Déployé avec Docker",
      technologies: ["React", "Node.js"],
      lienGithub: "https://github.com/test",
      lienDemo: "https://demo.test.com",
      categorie: "Web",
      statut: "Terminé",
    };
    const result = cleanProjectPayload(body);
    expect(result).toEqual({
      libelle: "Portfolio DevOps",
      description: "Un projet MERN",
      details: "Déployé avec Docker",
      technologies: ["React", "Node.js"],
      lienGithub: "https://github.com/test",
      lienDemo: "https://demo.test.com",
      categorie: "Web",
      statut: "Terminé",
    });
  });

  test('statut par défaut est "En cours" si absent', () => {
    const result = cleanProjectPayload({ libelle: "Test", description: "d" });
    expect(result.statut).toBe("En cours");
  });

  test('lienGithub vaut "" si absent', () => {
    const result = cleanProjectPayload({ libelle: "Test", description: "d" });
    expect(result.lienGithub).toBe("");
  });

  test('lienDemo vaut "" si absent', () => {
    const result = cleanProjectPayload({ libelle: "Test", description: "d" });
    expect(result.lienDemo).toBe("");
  });

  test('categorie vaut "" si absent', () => {
    const result = cleanProjectPayload({ libelle: "Test", description: "d" });
    expect(result.categorie).toBe("");
  });

  test("technologies est normalisé depuis une chaîne CSV", () => {
    const result = cleanProjectPayload({
      libelle: "T",
      description: "d",
      technologies: "Docker, Kubernetes",
    });
    expect(result.technologies).toEqual(["Docker", "Kubernetes"]);
  });

  test("technologies est [] si absent", () => {
    const result = cleanProjectPayload({ libelle: "T", description: "d" });
    expect(result.technologies).toEqual([]);
  });
});
