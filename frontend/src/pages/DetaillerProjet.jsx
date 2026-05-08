import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getImageUrl, getProjectById } from "../services/projetService";

export default function DetaillerProjet() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProject() {
      try {
        setLoading(true);
        setError("");

        const data = await getProjectById(id);
        setProject(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Impossible de charger le projet.");
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [id]);

  if (loading) {
    return (
      <section className="mx-auto max-w-4xl space-y-6">
        <Link to="/projets" className="text-sm text-rose-300 hover:underline">
          &larr; Retour à la liste
        </Link>

        <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-6">
          <p className="text-slate-400">Chargement du projet...</p>
        </div>
      </section>
    );
  }

  if (error || !project) {
    return (
      <section className="mx-auto max-w-4xl space-y-6">
        <Link to="/projets" className="text-sm text-rose-300 hover:underline">
          &larr; Retour à la liste
        </Link>

        <div className="rounded-lg border border-red-800 bg-red-950/30 p-6">
          <p className="text-sm text-red-400">
            {error || "Projet introuvable."}
          </p>
        </div>
      </section>
    );
  }

  const imageSrc = getImageUrl(project.image);

  return (
    <section className="mx-auto max-w-5xl space-y-8">
      <Link
        to="/projets"
        className="inline-flex text-sm text-rose-300 hover:underline"
      >
        &larr; Retour à la liste
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="motion-fade-up overflow-hidden rounded-lg border border-slate-800 bg-slate-900/80">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={project.libelle}
              className="h-full min-h-80 w-full object-cover"
            />
          ) : (
            <div className="flex h-80 items-center justify-center text-sm text-slate-500">
              Aucune image disponible
            </div>
          )}
        </div>

        <div className="motion-fade-up space-y-6" style={{ "--motion-delay": "120ms" }}>
          <div>
            <p className="text-sm font-mono uppercase tracking-[0.3em] text-rose-300">
              Projet
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white">
              {project.libelle}
            </h1>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-5">
            <h2 className="mb-3 text-lg font-semibold text-white">
              Description
            </h2>
            <p className="leading-7 text-slate-400">
              {project.description || "Aucune description disponible."}
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-5">
            <h2 className="mb-3 text-lg font-semibold text-white">
              Informations complémentaires
            </h2>
            <p className="leading-7 text-slate-400">
              {project.details || "Aucun détail supplémentaire disponible."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
