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
        <Link to="/projets" className="inline-flex items-center gap-2 text-sm text-purple-300 transition-colors hover:text-purple-200">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour à la liste
        </Link>

        <div className="glass-panel rounded-2xl p-8">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500/20 border-t-purple-500" />
            <p className="text-slate-400">Chargement du projet...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !project) {
    return (
      <section className="mx-auto max-w-4xl space-y-6">
        <Link to="/projets" className="inline-flex items-center gap-2 text-sm text-purple-300 transition-colors hover:text-purple-200">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour à la liste
        </Link>

        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 backdrop-blur-xl">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20">
              <svg className="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Erreur</h2>
              <p className="mt-1 text-sm text-red-300">
                {error || "Projet introuvable."}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const imageSrc = getImageUrl(project.image);
  const technologies = Array.isArray(project.technologies)
    ? project.technologies.filter(Boolean)
    : [];
  const infoItems = [
    ["Statut", project.statut || "Non renseigné", getStatusColor(project.statut)],
    ["Catégorie", project.categorie || "Non renseignée", "cyan"],
    ["Technologies", technologies.length > 0 ? `${technologies.length}` : "0", "purple"],
  ];

  function getStatusColor(statut) {
    switch (statut) {
      case "Terminé":
      case "Termine":
        return "emerald";
      case "En cours":
        return "cyan";
      case "Maintenance":
        return "purple";
      case "Archive":
        return "slate";
      default:
        return "slate";
    }
  }

  return (
    <section className="mx-auto max-w-6xl space-y-8">
      <Link
        to="/projets"
        className="inline-flex items-center gap-2 text-sm text-purple-300 transition-colors hover:text-purple-200"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Retour à la liste
      </Link>

      <div className="glass-panel motion-fade-up overflow-hidden rounded-2xl">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative min-h-[400px] bg-slate-900">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={project.libelle}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full min-h-[400px] items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10">
                    <svg className="h-8 w-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-400">Aucune image disponible</p>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2">
                <span className="text-sm font-semibold text-cyan-300">Project</span>
              </div>
              <h1 className="text-balance text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                {project.libelle}
              </h1>
            </div>
          </div>

          <div className="space-y-6 p-6 sm:p-8">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-2">
                <span className="text-sm font-semibold text-pink-300">Synthèse</span>
              </div>
              <div className="space-y-3">
                {infoItems.map(([title, label, color], index) => (
                  <div
                    key={title}
                    className="motion-fade-up flex items-center justify-between rounded-xl border border-purple-500/20 bg-slate-900/50 px-4 py-3 backdrop-blur-sm"
                    style={{ "--motion-delay": `${index * 90}ms` }}
                  >
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <span className={`text-sm font-semibold text-${color}-300`}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-purple-500/20 bg-slate-900/50 p-5 backdrop-blur-sm">
              <h2 className="text-lg font-bold text-white">Description</h2>
              <p className="mt-3 leading-relaxed text-slate-300">
                {project.description || "Aucune description disponible."}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {project.lienGithub ? (
                <a
                  href={project.lienGithub}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/50 px-5 py-3 text-sm font-medium text-slate-300 backdrop-blur-sm transition-all hover:border-purple-500/50 hover:bg-purple-500/10 hover:text-white"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  GitHub
                </a>
              ) : null}

              {project.lienDemo ? (
                <a
                  href={project.lienDemo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-purple-500/30 transition-transform hover:scale-105"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Voir la démo
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-panel motion-fade-up rounded-2xl p-6 sm:p-8">
          <h2 className="mb-4 text-2xl font-bold text-white">
            Informations complémentaires
          </h2>
          <p className="leading-relaxed text-slate-300">
            {project.details || "Aucun détail supplémentaire disponible."}
          </p>
        </div>

        <div className="glass-panel motion-fade-up rounded-2xl p-6 sm:p-8" style={{ "--motion-delay": "120ms" }}>
          <h2 className="mb-4 text-2xl font-bold text-white">Technologies</h2>
          {technologies.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {technologies.map((item) => (
                <span
                  key={item}
                  className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-300"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">
              Aucune technologie renseignée.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
