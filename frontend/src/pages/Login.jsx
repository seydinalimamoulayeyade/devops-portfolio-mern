import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const accessChecks = [
  ["API", "localhost:5000"],
  ["Cloud", "AWS"],
  ["Pipeline", "Jenkins"],
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur de connexion");
      }

      login(data.token);
      navigate("/projets");
    } catch (err) {
      setError(err.message || "Impossible de se connecter.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="motion-fade-up mx-auto max-w-6xl overflow-hidden rounded-2xl border border-purple-500/20 bg-slate-900/40 shadow-2xl shadow-purple-950/30 backdrop-blur-xl sm:mt-10">
      <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative overflow-hidden border-b border-purple-500/20 bg-slate-950 p-6 sm:p-10 lg:border-b-0 lg:border-r">
          <div
            className="absolute inset-0 opacity-30"
            style={{ backgroundImage: "url('/images/pipeline-cicd.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/50 to-slate-950/80" />

          <div className="relative space-y-8">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2">
                <span className="text-sm font-semibold text-cyan-300">Console admin</span>
              </div>
              <h1 className="text-balance text-3xl font-bold leading-tight text-white sm:text-4xl">
                Accès sécurisé aux livrables DevOps.
              </h1>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Connectez-vous pour publier, modifier et maintenir les projets MERN, Laravel et AWS du portfolio.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {accessChecks.map(([title, value], index) => (
                <div
                  key={title}
                  className="motion-fade-up rounded-xl border border-purple-500/20 bg-slate-900/50 p-5 backdrop-blur-sm"
                  style={{ "--motion-delay": `${index * 90}ms` }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {title}
                  </p>
                  <p className="mt-2 font-mono text-base text-cyan-300">{value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Stack prête
              </div>
              <p className="mt-3 text-sm leading-relaxed text-emerald-200/90">
                Le backend répond, signe les sessions avec JWT et documente le socle DevOps du portfolio.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <div className="mb-8 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-2">
              <span className="text-sm font-semibold text-pink-300">Authentification</span>
            </div>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Connexion</h2>
            <p className="text-base text-slate-400">
              Session protégée pour gérer les projets.
            </p>
          </div>

          {error ? (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <svg className="h-5 w-5 shrink-0 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-300">{error}</p>
              </div>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
              <input
                type="email"
                placeholder="admin@test.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full rounded-xl border border-purple-500/30 bg-slate-900/50 px-4 py-3 text-sm text-white outline-none backdrop-blur-sm transition-colors placeholder:text-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Mot de passe
              </label>
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full rounded-xl border border-purple-500/30 bg-slate-900/50 px-4 py-3 text-sm text-white outline-none backdrop-blur-sm transition-colors placeholder:text-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  Connexion en cours...
                </span>
              ) : (
                "Ouvrir la console"
              )}
            </button>
          </form>

          <div className="mt-8 border-t border-purple-500/20 pt-6">
            <Link
              to="/projets"
              className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-cyan-300"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voir les projets publics
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
