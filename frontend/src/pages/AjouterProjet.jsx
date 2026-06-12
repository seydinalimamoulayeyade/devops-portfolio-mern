import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addProject,
  getImageUrl,
  getProjectById,
  updateProject,
} from "../services/projetService";

const initialState = {
  libelle: "",
  description: "",
  image: "",
  details: "",
  technologies: "",
  lienGithub: "",
  lienDemo: "",
  categorie: "",
  statut: "En cours",
};

const publishingSteps = [
  ["Stack", "Technologies et catégorie du projet"],
  ["DevOps", "Docker, CI/CD et scans qualité"],
  ["Cloud", "AWS, monitoring et contexte de livraison"],
];

export default function AjouterProjet() {
  const [form, setForm] = useState(initialState);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditing = Boolean(id);

  useEffect(() => {
    async function loadProject() {
      if (!isEditing) return;

      try {
        setLoading(true);
        setError("");

        const data = await getProjectById(id);
        setForm({
          libelle: data.libelle || "",
          description: data.description || "",
          image: data.image || "",
          details: data.details || "",
          technologies: Array.isArray(data.technologies)
            ? data.technologies.join(", ")
            : data.technologies || "",
          lienGithub: data.lienGithub || "",
          lienDemo: data.lienDemo || "",
          categorie: data.categorie || "",
          statut: data.statut || "En cours",
        });
      } catch (err) {
        console.error(err);
        setError("Impossible de charger le projet à modifier.");
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [id, isEditing]);

  const previewSrc = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    return getImageUrl(form.image);
  }, [imageFile, form.image]);

  useEffect(() => {
    return () => {
      if (imageFile && previewSrc.startsWith("blob:")) {
        URL.revokeObjectURL(previewSrc);
      }
    };
  }, [imageFile, previewSrc]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];
    setImageFile(file || null);
  }

  function buildFormData() {
    const formData = new FormData();

    formData.append("libelle", form.libelle);
    formData.append("description", form.description);
    formData.append("details", form.details);
    formData.append("technologies", form.technologies);
    formData.append("lienGithub", form.lienGithub);
    formData.append("lienDemo", form.lienDemo);
    formData.append("categorie", form.categorie);
    formData.append("statut", form.statut);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    return formData;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      setSaving(true);
      const payload = buildFormData();

      if (isEditing) {
        await updateProject(id, payload);
      } else {
        await addProject(payload);
      }

      navigate("/projets");
    } catch (err) {
      console.error(err);
      setError(
        isEditing
          ? "Impossible de modifier le projet."
          : "Impossible d'ajouter le projet.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-2xl space-y-6">
        <div className="glass-panel rounded-2xl p-8">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500/20 border-t-purple-500" />
            <h1 className="text-2xl font-bold text-white">
              Chargement du projet...
            </h1>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl space-y-8">
      <div className="motion-fade-up space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2">
          <span className="text-sm font-semibold text-purple-300">
            {isEditing ? "Edition" : "Nouveau projet"}
          </span>
        </div>
        <h1 className="text-balance text-3xl font-bold leading-tight text-white sm:text-4xl">
          {isEditing ? "Modifier un projet" : "Ajouter un projet AWS-ready"}
        </h1>
        <p className="max-w-3xl text-lg text-slate-400">
          {isEditing
            ? "Mettez à jour les informations du projet, son image et son angle technique."
            : "Renseignez un livrable clair, avec assez de contexte pour comprendre sa valeur produit, technique, DevOps et cloud AWS."}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <form
          onSubmit={handleSubmit}
          className="glass-panel motion-fade-up space-y-6 rounded-2xl p-6 sm:p-8"
          style={{ "--motion-delay": "120ms" }}
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Libellé</label>
            <input
              type="text"
              name="libelle"
              value={form.libelle}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-purple-500/30 bg-slate-900/50 px-4 py-3 text-sm text-white outline-none backdrop-blur-sm transition-colors focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              required
              className="w-full rounded-xl border border-purple-500/30 bg-slate-900/50 px-4 py-3 text-sm text-white outline-none backdrop-blur-sm transition-colors focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Catégorie
              </label>
              <input
                type="text"
                name="categorie"
                placeholder="MERN, Laravel, DevOps..."
                value={form.categorie}
                onChange={handleChange}
                className="w-full rounded-xl border border-purple-500/30 bg-slate-900/50 px-4 py-3 text-sm text-white outline-none backdrop-blur-sm transition-colors placeholder:text-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Statut</label>
              <select
                name="statut"
                value={form.statut}
                onChange={handleChange}
                className="w-full rounded-xl border border-purple-500/30 bg-slate-900/50 px-4 py-3 text-sm text-white outline-none backdrop-blur-sm transition-colors focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              >
                <option value="En cours">En cours</option>
                <option value="Terminé">Terminé</option>
                <option value="Termine">Terminé</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Archive">Archive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Technologies
            </label>
            <input
              type="text"
              name="technologies"
              placeholder="React, Node.js, Docker, AWS"
              value={form.technologies}
              onChange={handleChange}
              className="w-full rounded-xl border border-purple-500/30 bg-slate-900/50 px-4 py-3 text-sm text-white outline-none backdrop-blur-sm transition-colors placeholder:text-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            />
            <p className="mt-2 text-xs text-slate-500">
              Séparez les technologies par des virgules.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Lien GitHub
              </label>
              <input
                type="url"
                name="lienGithub"
                placeholder="https://github.com/..."
                value={form.lienGithub}
                onChange={handleChange}
                className="w-full rounded-xl border border-purple-500/30 bg-slate-900/50 px-4 py-3 text-sm text-white outline-none backdrop-blur-sm transition-colors placeholder:text-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Lien démo
              </label>
              <input
                type="url"
                name="lienDemo"
                placeholder="https://..."
                value={form.lienDemo}
                onChange={handleChange}
                className="w-full rounded-xl border border-purple-500/30 bg-slate-900/50 px-4 py-3 text-sm text-white outline-none backdrop-blur-sm transition-colors placeholder:text-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Image du projet
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full rounded-xl border border-dashed border-purple-500/30 bg-slate-900/50 px-4 py-3 text-sm text-slate-300 backdrop-blur-sm file:mr-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-purple-500 file:to-pink-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white file:shadow-lg file:shadow-purple-500/30 hover:file:scale-105"
            />
            <p className="mt-2 text-xs text-slate-500">
              Formats acceptés : JPG, PNG, WEBP ou GIF. Taille maximale : 5 Mo.
            </p>

            {previewSrc ? (
              <div className="mt-4 overflow-hidden rounded-xl border border-purple-500/20 bg-slate-900/50">
                <img
                  src={previewSrc}
                  alt="Aperçu du projet"
                  className="h-64 w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            ) : (
              <div className="mt-4 flex h-64 items-center justify-center rounded-xl border border-dashed border-purple-500/30 bg-slate-900/50 backdrop-blur-sm">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2 text-sm text-slate-500">Aucun aperçu disponible</p>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Détails</label>
            <textarea
              name="details"
              value={form.details}
              onChange={handleChange}
              rows="6"
              className="w-full rounded-xl border border-purple-500/30 bg-slate-900/50 px-4 py-3 text-sm text-white outline-none backdrop-blur-sm transition-colors focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          {error ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 backdrop-blur-sm">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-4">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 sm:w-auto"
            >
              {saving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  Enregistrement...
                </>
              ) : (
                <>
                  {isEditing ? "Enregistrer les modifications" : "Ajouter le projet"}
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/projets")}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/50 px-6 py-3 text-sm font-semibold text-slate-300 backdrop-blur-sm transition-colors hover:border-purple-500/50 hover:text-white sm:w-auto"
            >
              Annuler
            </button>
          </div>
        </form>

        <aside className="motion-fade-up space-y-6" style={{ "--motion-delay": "220ms" }}>
          <div className="glass-panel rounded-2xl p-6">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2">
              <span className="text-sm font-semibold text-cyan-300">Publication</span>
            </div>
            <div className="space-y-5">
              {publishingSteps.map(([title, text], index) => (
                <div key={title} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 text-sm font-bold text-cyan-300">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-white">{title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-400">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20">
                <svg className="h-5 w-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="font-bold text-emerald-300">Conseil DevOps</p>
            </div>
            <p className="text-sm leading-relaxed text-emerald-200/90">
              Ajoutez dans les détails les choix AWS, le pipeline Jenkins, la
              conteneurisation Docker et les scans SonarQube/Trivy.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default function AjouterProjet() {
  const [form, setForm] = useState(initialState);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditing = Boolean(id);

  useEffect(() => {
    async function loadProject() {
      if (!isEditing) return;

      try {
        setLoading(true);
        setError("");

        const data = await getProjectById(id);
        setForm({
          libelle: data.libelle || "",
          description: data.description || "",
          image: data.image || "",
          details: data.details || "",
          technologies: Array.isArray(data.technologies)
            ? data.technologies.join(", ")
            : data.technologies || "",
          lienGithub: data.lienGithub || "",
          lienDemo: data.lienDemo || "",
          categorie: data.categorie || "",
          statut: data.statut || "En cours",
        });
      } catch (err) {
        console.error(err);
        setError("Impossible de charger le projet a modifier.");
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [id, isEditing]);

  const previewSrc = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    return getImageUrl(form.image);
  }, [imageFile, form.image]);

  useEffect(() => {
    return () => {
      if (imageFile && previewSrc.startsWith("blob:")) {
        URL.revokeObjectURL(previewSrc);
      }
    };
  }, [imageFile, previewSrc]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];
    setImageFile(file || null);
  }

  function buildFormData() {
    const formData = new FormData();

    formData.append("libelle", form.libelle);
    formData.append("description", form.description);
    formData.append("details", form.details);
    formData.append("technologies", form.technologies);
    formData.append("lienGithub", form.lienGithub);
    formData.append("lienDemo", form.lienDemo);
    formData.append("categorie", form.categorie);
    formData.append("statut", form.statut);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    return formData;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      setSaving(true);
      const payload = buildFormData();

      if (isEditing) {
        await updateProject(id, payload);
      } else {
        await addProject(payload);
      }

      navigate("/projets");
    } catch (err) {
      console.error(err);
      setError(
        isEditing
          ? "Impossible de modifier le projet."
          : "Impossible d'ajouter le projet.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold text-white">
          Chargement du projet...
        </h1>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <div className="motion-fade-up">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-rose-300 sm:text-sm sm:tracking-[0.3em]">
          {isEditing ? "Edition" : "Nouveau projet"}
        </p>
        <h1 className="mt-2 text-balance text-2xl font-bold leading-tight text-white sm:text-3xl">
          {isEditing ? "Modifier un projet" : "Ajouter un projet AWS-ready"}
        </h1>
        <p className="mt-2 max-w-2xl text-slate-400">
          {isEditing
            ? "Mettez a jour les informations du projet, son image et son angle technique."
            : "Renseignez un livrable clair, avec assez de contexte pour comprendre sa valeur produit, technique, DevOps et cloud AWS."}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <form
          onSubmit={handleSubmit}
          className="glass-panel motion-fade-up space-y-5 rounded-lg p-4 sm:p-6"
          style={{ "--motion-delay": "120ms" }}
        >
          <div>
            <label className="mb-2 block text-sm text-slate-300">Libelle</label>
            <input
              type="text"
              name="libelle"
              value={form.libelle}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-cyan-300"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-cyan-300"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Categorie
              </label>
              <input
                type="text"
                name="categorie"
                placeholder="MERN, Laravel, DevOps..."
                value={form.categorie}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-cyan-300"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">Statut</label>
              <select
                name="statut"
                value={form.statut}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-cyan-300"
              >
                <option value="En cours">En cours</option>
                <option value="Termine">Termine</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Archive">Archive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Technologies
            </label>
            <input
              type="text"
              name="technologies"
              placeholder="React, Node.js, Docker, AWS"
              value={form.technologies}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-cyan-300"
            />
            <p className="mt-2 text-xs text-slate-500">
              Separez les technologies par des virgules.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Lien GitHub
              </label>
              <input
                type="url"
                name="lienGithub"
                placeholder="https://github.com/..."
                value={form.lienGithub}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-cyan-300"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Lien demo
              </label>
              <input
                type="url"
                name="lienDemo"
                placeholder="https://..."
                value={form.lienDemo}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-cyan-300"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Image du projet
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full rounded-lg border border-dashed border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-rose-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-rose-600"
            />
            <p className="mt-2 text-xs text-slate-500">
              Formats acceptes : JPG, PNG, WEBP ou GIF. Taille maximale : 5 Mo.
            </p>

            {previewSrc ? (
              <div className="mt-4 overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
                <img
                  src={previewSrc}
                  alt="Apercu du projet"
                  className="h-64 w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            ) : (
              <div className="mt-4 flex h-44 items-center justify-center rounded-lg border border-dashed border-slate-800 bg-slate-950 text-sm text-slate-500">
                Aucun apercu disponible
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Details</label>
            <textarea
              name="details"
              value={form.details}
              onChange={handleChange}
              rows="5"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-cyan-300"
            />
          </div>

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex w-full justify-center rounded-lg bg-rose-500 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-rose-600 disabled:opacity-50 sm:w-auto"
            >
              {saving
                ? "Enregistrement..."
                : isEditing
                  ? "Enregistrer les modifications"
                  : "Ajouter le projet"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/projets")}
              className="inline-flex w-full justify-center rounded-lg border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition-colors hover:border-slate-500 hover:text-white sm:w-auto"
            >
              Annuler
            </button>
          </div>
        </form>

        <aside className="motion-fade-up space-y-4" style={{ "--motion-delay": "220ms" }}>
          <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-5">
            <p className="text-sm font-mono uppercase tracking-[0.24em] text-cyan-300">
              Publication
            </p>
            <div className="mt-5 space-y-4">
              {publishingSteps.map(([title, text], index) => (
                <div key={title} className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-300/10 text-xs font-semibold text-cyan-200">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-5">
            <p className="text-sm font-semibold text-emerald-200">
              Conseil DevOps
            </p>
            <p className="mt-2 text-sm leading-6 text-emerald-100/75">
              Ajoutez dans les details les choix AWS, le pipeline Jenkins, la
              conteneurisation Docker et les scans SonarQube/Trivy.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
