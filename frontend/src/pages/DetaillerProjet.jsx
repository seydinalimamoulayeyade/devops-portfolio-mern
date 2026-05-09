import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getImageUrl, getProjectById } from "../services/projetService";

const deliveryChecks = [
  ["Build", "Pipeline Jenkins"],
  ["Scan", "SonarQube/Trivy"],
  ["Cloud", "AWS ciblé"],
];

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

      <div className="glass-panel motion-fade-up overflow-hidden rounded-lg">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative min-h-[300px] bg-slate-900 sm:min-h-[360px]">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={project.libelle}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full min-h-[300px] items-center justify-center text-sm text-slate-500 sm:min-h-[360px]">
                Aucune image disponible
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-300 sm:tracking-[0.3em]">
                Project release
              </p>
              <h1 className="mt-3 text-balance text-2xl font-bold leading-tight text-white sm:text-4xl">
                {project.libelle}
              </h1>
            </div>
          </div>

          <div className="space-y-5 p-4 sm:p-6">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-rose-300 sm:text-sm sm:tracking-[0.3em]">
                Delivery status
              </p>
              <div className="mt-4 space-y-3">
                {deliveryChecks.map(([title, label], index) => (
                  <div
                    key={title}
                    className="motion-fade-up flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-3"
                    style={{ "--motion-delay": `${index * 90}ms` }}
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">{title}</p>
                      <p className="mt-1 text-xs text-slate-500">{label}</p>
                    </div>
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.5)]" />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4 sm:p-5">
              <h2 className="text-lg font-semibold text-white">Description</h2>
              <p className="mt-3 leading-7 text-slate-400">
                {project.description || "Aucune description disponible."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <div className="motion-fade-up rounded-lg border border-slate-800 bg-slate-900/80 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-white">
            Informations complémentaires
          </h2>
          <p className="mt-3 leading-7 text-slate-400">
            {project.details || "Aucun détail supplémentaire disponible."}
          </p>
        </div>

        <div className="motion-fade-up rounded-lg border border-slate-800 bg-slate-900/80 p-4 sm:p-5" style={{ "--motion-delay": "120ms" }}>
          <h2 className="text-lg font-semibold text-white">Vue technique</h2>
          <div className="mt-4 space-y-3 text-sm">
            {["MERN stack", "Laravel/Tailwind", "Docker/Kubernetes", "AWS + monitoring"].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between border-b border-slate-800 pb-3 last:border-0 last:pb-0"
              >
                <span className="text-slate-400">{item}</span>
                <span className="text-cyan-300">ready</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
