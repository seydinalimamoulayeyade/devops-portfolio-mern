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
    <section className="mx-auto max-w-2xl space-y-6">
      <div className="motion-fade-up">
        <p className="text-sm font-mono uppercase tracking-[0.3em] text-rose-300">
          {isEditing ? "Edition" : "Nouveau projet"}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">
          {isEditing ? "Modifier un projet" : "Ajouter un projet"}
        </h1>
        <p className="mt-2 text-slate-400">
          {isEditing
            ? "Mettez à jour les informations du projet. Vous pouvez conserver l'image actuelle ou en choisir une nouvelle."
            : "Remplissez le formulaire et choisissez une image pour créer un nouveau projet."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="motion-fade-up space-y-5 rounded-lg border border-slate-800 bg-slate-900/80 p-6"
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
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-rose-400"
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
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-rose-400"
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
                className="h-56 w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          ) : (
            <div className="mt-4 flex h-40 items-center justify-center rounded-lg border border-dashed border-slate-800 bg-slate-950 text-sm text-slate-500">
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
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-rose-400"
          />
        </div>

        {error ? <p className="text-sm text-rose-300">{error}</p> : null}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex rounded-lg bg-rose-500 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-rose-600 disabled:opacity-50"
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
            className="inline-flex rounded-lg border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
          >
            Annuler
          </button>
        </div>
      </form>
    </section>
  );
}
