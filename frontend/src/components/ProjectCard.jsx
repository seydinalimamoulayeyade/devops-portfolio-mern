import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { getImageUrl } from "../services/projetService";

export default function ProjectCard({ project, onDelete }) {
  const { isAuthenticated } = useAuth();

  const projectId = project._id || project.id;
  const imageSrc = getImageUrl(project.image);

  return (
    <article className="motion-hover-lift group overflow-hidden rounded-lg border border-slate-800 bg-slate-900/90 shadow-sm transition-all duration-300 hover:border-rose-400/70 hover:shadow-[0_0_0_1px_rgba(244,63,94,0.12)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-800">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={project.libelle}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            Aucune image
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 rounded-lg border border-cyan-300/20 bg-slate-950/70 px-3 py-1.5 text-xs font-medium text-cyan-200 backdrop-blur">
          Cloud-ready
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <div className="space-y-2">
          <Link
            to={`/projets/${projectId}`}
            className="line-clamp-2 text-lg font-semibold text-white transition-colors hover:text-rose-300"
          >
            {project.libelle}
          </Link>

          <p className="line-clamp-3 text-sm leading-6 text-slate-400">
            {project.description || "Aucune description disponible."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {["MERN", "Docker", "AWS"].map((item) => (
            <span
              key={item}
              className="rounded-lg border border-slate-800 bg-slate-950/70 px-2.5 py-1 text-xs text-slate-400"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to={`/projets/${projectId}`}
            className="text-sm font-medium text-rose-300 transition-colors hover:text-rose-200"
          >
            Voir le détail &rarr;
          </Link>

          {isAuthenticated ? (
            <div className="grid grid-cols-2 gap-2 sm:flex">
              <Link
                to={`/modifier/${projectId}`}
                className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 transition-all hover:border-rose-400 hover:text-white"
              >
                Modifier
              </Link>

              <button
                type="button"
                onClick={() => onDelete(project)}
                className="inline-flex items-center justify-center rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white transition-all hover:bg-red-600"
              >
                Supprimer
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
