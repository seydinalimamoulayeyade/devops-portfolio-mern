import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="motion-fade-up mx-auto max-w-3xl space-y-6 rounded-lg border border-slate-800 bg-slate-900/85 p-8 text-center">
      <p className="text-sm font-mono uppercase tracking-[0.3em] text-rose-300">
        404
      </p>
      <h1 className="text-3xl font-bold text-white">Page introuvable</h1>
      <p className="text-slate-400">
        La page demandée n'existe pas ou n'est plus disponible.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          to="/"
          className="inline-flex items-center rounded-lg bg-rose-500 px-5 py-3 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-600"
        >
          Retour à l'accueil
        </Link>
        <Link
          to="/projets"
          className="inline-flex items-center rounded-lg border border-slate-600 px-5 py-3 text-sm font-medium text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-400 hover:text-white"
        >
          Voir les projets
        </Link>
      </div>
    </section>
  );
}
