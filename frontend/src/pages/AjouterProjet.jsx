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
};

const publishingSteps = [
  ["Stack", "MERN, Laravel ou Tailwind"],
  ["DevOps", "Docker, Jenkins et scans qualité"],
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
          {isEditing ? "Édition" : "Nouveau projet"}
        </p>
        <h1 className="mt-2 text-balance text-2xl font-bold leading-tight text-white sm:text-3xl">
          {isEditing ? "Modifier un projet" : "Ajouter un projet AWS-ready"}
        </h1>
        <p className="mt-2 max-w-2xl text-slate-400">
          {isEditing
            ? "Mettez à jour les informations du projet, son image et son angle technique."
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
            <label className="mb-2 block text-sm text-slate-300">Libellé</label>
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
              Formats acceptés : JPG, PNG, WEBP ou GIF. Taille maximale : 5 Mo.
            </p>

            {previewSrc ? (
              <div className="mt-4 overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
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
              <div className="mt-4 flex h-44 items-center justify-center rounded-lg border border-dashed border-slate-800 bg-slate-950 text-sm text-slate-500">
                Aucun aperçu disponible
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Détails</label>
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
              Ajoutez dans les détails les choix AWS, le pipeline Jenkins, la conteneurisation Docker et les scans SonarQube/Trivy.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
