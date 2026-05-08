import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { getImageUrl } from "../services/projetService";

export default function ProjectCard({ project, onDelete }) {
  const { isAuthenticated } = useAuth();

  const projectId = project._id || project.id;
  const imageSrc = getImageUrl(project.image);

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-rose-400/70 hover:shadow-[0_0_0_1px_rgba(244,63,94,0.12)]">
      <div className="relative h-48 overflow-hidden bg-slate-800">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={project.libelle}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-500 text-sm">
            Aucune image
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80"></div>
      </div>

      <div className="p-5 space-y-4">
        <div className="space-y-2">
          <Link
            to={`/projets/${projectId}`}
            className="line-clamp-2 text-lg font-semibold text-white transition-colors hover:text-rose-400"
          >
            {project.libelle}
          </Link>

          <p className="line-clamp-3 text-sm leading-6 text-slate-400">
            {project.description}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <Link
            to={`/projets/${projectId}`}
            className="text-sm font-medium text-rose-400 transition-colors hover:text-rose-300"
          >
            Voir le détail →
          </Link>

          {isAuthenticated && (
            <div className="flex gap-2">
              <Link
                to={`/modifier/${projectId}`}
                className="inline-flex items-center rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 transition-all hover:border-rose-400 hover:text-rose-400"
              >
                Modifier
              </Link>

              <button
                onClick={() => onDelete(projectId)}
                className="inline-flex items-center rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white transition-all hover:bg-red-600"
              >
                Supprimer
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
