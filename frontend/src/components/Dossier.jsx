import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProjectCard from "./ProjectCard";
import ProjectCardSkeleton from "./ProjectCardSkeleton";
import { useAuth } from "../context/useAuth";
import { deleteProject, getAllProjects } from "../services/projetService";

const dashboardStats = [
  ["AWS", "Cloud cible"],
  ["Jenkins", "CI/CD"],
  ["Docker", "Run ready"],
];

function DeleteProjectDialog({ project, deleting, onCancel, onConfirm }) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/80 px-5 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-project-title"
        className="motion-fade-up w-full max-w-md rounded-lg border border-red-400/20 bg-slate-950 p-6 shadow-2xl shadow-slate-950/60"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-red-400/25 bg-red-400/10 text-red-300">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
            >
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path d="m10.3 3.9-8.1 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.8-3.1l-8.1-14a2 2 0 0 0-3.4 0Z" />
            </svg>
          </div>

          <div>
            <p className="text-sm font-mono uppercase tracking-[0.24em] text-red-300">
              Suppression
            </p>
            <h2 id="delete-project-title" className="mt-2 text-xl font-semibold text-white">
              Supprimer ce projet ?
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Cette action retirera définitivement{" "}
              <span className="font-medium text-slate-200">{project.libelle}</span>{" "}
              du catalogue.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="inline-flex justify-center rounded-lg border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition-colors hover:border-slate-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="inline-flex justify-center rounded-lg bg-red-500 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? "Suppression..." : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Dossier() {
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true);
        setError("");

        const data = await getAllProjects();
        setProjects(data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les projets.");
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  function requestDelete(project) {
    setError("");
    setSuccess("");
    setProjectToDelete(project);
  }

  async function confirmDelete() {
    if (!projectToDelete) return;
    const id = projectToDelete._id || projectToDelete.id;
    try {
      setDeleting(true);
      await deleteProject(id);
      setProjects((prev) =>
        prev.filter((project) => (project._id || project.id) !== id),
      );
      setSuccess("Projet supprimé avec succès.");
      setProjectToDelete(null);
    } catch (err) {
      console.error(err);
      setError("La suppression a échoué.");
    } finally {
      setDeleting(false);
    }
  }

  const filteredProjects = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return projects;

    return projects.filter((project) =>
      project.libelle.toLowerCase().includes(value),
    );
  }, [projects, search]);

  return (
    <section className="space-y-8">
      <div className="glass-panel motion-fade-up overflow-hidden rounded-lg">
        <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div className="max-w-2xl space-y-4">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-300 sm:text-sm sm:tracking-[0.3em]">
              Catalogue technique
            </p>
            <h1 className="text-balance text-2xl font-bold leading-tight text-white sm:text-4xl">
              Projets MERN/Laravel pensés pour AWS et la livraison continue.
            </h1>
            <p className="text-sm leading-7 text-slate-400 sm:text-base">
              Retrouvez les réalisations, recherchez un projet et gérez les livrables depuis une interface React connectée à une API sécurisée, prête à être conteneurisée et monitorée.
            </p>
            {isAuthenticated ? (
              <span className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs font-medium text-cyan-200">
                <span className="h-2 w-2 rounded-full bg-cyan-300" />
                Console admin active
              </span>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-3 sm:p-4">
              <p className="text-2xl font-bold text-white">{projects.length}</p>
              <p className="mt-1 text-xs text-cyan-200">Projets</p>
            </div>
            {dashboardStats.map(([title, label]) => (
              <div
                key={title}
                className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 sm:p-4"
              >
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="mt-1 text-xs text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-800 bg-slate-950/45 p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <label htmlFor="search-project" className="sr-only">
              Rechercher un projet
            </label>

            <div className="relative flex-1">
              <input
                id="search-project"
                type="text"
                placeholder="Rechercher : AWS, Docker, Laravel..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 pr-11 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-cyan-300"
              />
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </div>

            {isAuthenticated ? (
              <Link
                to="/ajouter"
                className="inline-flex items-center justify-center rounded-lg bg-rose-500 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-rose-600"
              >
                Ajouter un projet
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition-colors hover:border-cyan-300 hover:text-white"
              >
                Se connecter pour publier
              </Link>
            )}
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-800 bg-red-950/30 px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      ) : null}

      {success ? (
        <div className="rounded-lg border border-emerald-800 bg-emerald-950/30 px-4 py-3">
          <p className="text-sm text-emerald-400">{success}</p>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 border-b border-slate-800 pb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p className="text-sm text-slate-400">
          {loading ? "Chargement..." : `${filteredProjects.length} projet(s) trouvé(s)`}
        </p>

        {search ? (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="text-sm text-slate-400 transition-colors hover:text-rose-300"
          >
            Réinitialiser la recherche
          </button>
        ) : null}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProjectCardSkeleton key={index} />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-6 text-center sm:p-10">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-slate-700 text-lg font-semibold text-slate-500">
            0
          </div>
          <h2 className="text-lg font-semibold text-white">Aucun projet trouvé</h2>
          <p className="mt-2 text-sm text-slate-400">
            Essayez un autre mot-clé ou ajoutez un nouveau projet à votre collection.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project, index) => (
            <div
              key={project._id || project.id}
              className="motion-fade-up"
              style={{ "--motion-delay": `${Math.min(index, 6) * 70}ms` }}
            >
              <ProjectCard project={project} onDelete={requestDelete} />
            </div>
          ))}
        </div>
      )}

      <DeleteProjectDialog
        project={projectToDelete}
        deleting={deleting}
        onCancel={() => setProjectToDelete(null)}
        onConfirm={confirmDelete}
      />
    </section>
  );
}
