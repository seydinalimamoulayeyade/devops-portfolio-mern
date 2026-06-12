import { Link } from "react-router-dom";
import { getImageUrl } from "../services/projetService";

export default function ModernProjectCard({ project, index = 0 }) {
  const projectId = project._id || project.id;
  const imageSrc = getImageUrl(project.image);

  // Extract technologies (limit to 4)
  const technologies = project.technologies?.slice(0, 4) || [];

  return (
    <article
      className="motion-fade-up group relative overflow-hidden rounded-2xl border border-purple-500/20 bg-slate-900/40 backdrop-blur-sm transition-all duration-500 hover:border-purple-500/60 hover:bg-slate-900/60"
      style={{ "--motion-delay": `${index * 100}ms` }}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-500/0 via-pink-500/0 to-cyan-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-10" />

      {/* Image container */}
      <div className="relative aspect-video overflow-hidden bg-slate-800">
        {imageSrc ? (
          <>
            <img
              src={imageSrc}
              alt={project.libelle}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10">
                <svg
                  className="h-8 w-8 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-sm text-slate-500">No image</p>
            </div>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute right-3 top-3">
          <span className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Live
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 p-6">
        {/* Category */}
        <div className="flex items-center gap-2">
          <span className="inline-block h-1 w-1 rounded-full bg-purple-400" />
          <span className="text-xs font-mono uppercase tracking-wider text-purple-300">
            Project
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white transition-colors group-hover:text-purple-300">
          {project.libelle}
        </h3>

        {/* Description */}
        <p className="line-clamp-2 text-sm leading-relaxed text-slate-400">
          {project.description || "No description available."}
        </p>

        {/* Technologies */}
        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-slate-700/50 bg-slate-800/50 px-2.5 py-1 text-xs font-medium text-slate-300"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <Link
            to={`/projets/${projectId}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-purple-400 transition-colors hover:text-purple-300"
          >
            View project
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>

          {/* Project type badge */}
          <span className="text-xs text-slate-500">
            {project.type || "Web App"}
          </span>
        </div>
      </div>

      {/* Shine effect on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent [animation:shimmer_2s_infinite]" />
      </div>
    </article>
  );
}
