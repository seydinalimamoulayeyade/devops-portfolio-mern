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
    <section className="motion-fade-up mx-auto max-w-5xl overflow-hidden rounded-lg border border-slate-800 bg-slate-900/85 shadow-2xl shadow-slate-950/30 sm:mt-10">
      <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative overflow-hidden border-b border-slate-800 bg-slate-950 p-5 sm:p-8 lg:border-b-0 lg:border-r">
          <div
            className="absolute inset-0 opacity-50"
            style={{ backgroundImage: "url('/images/pipeline-cicd.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/92 to-slate-950/65" />

          <div className="relative space-y-8">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-300 sm:text-sm sm:tracking-[0.3em]">
                Console admin
              </p>
              <h1 className="mt-3 text-balance text-2xl font-bold leading-tight text-white sm:text-3xl">
                Accès sécurisé aux livrables DevOps.
              </h1>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Connectez-vous pour publier, modifier et maintenir les projets MERN, Laravel et AWS du portfolio.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {accessChecks.map(([title, value], index) => (
                <div
                  key={title}
                  className="motion-fade-up rounded-lg border border-slate-800 bg-slate-950/75 p-4"
                  style={{ "--motion-delay": `${index * 90}ms` }}
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                    {title}
                  </p>
                  <p className="mt-2 font-mono text-sm text-cyan-200">{value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-200">
                <span className="motion-status-dot h-2 w-2 rounded-full bg-current text-emerald-300" />
                Stack prête
              </div>
              <p className="mt-2 text-sm leading-6 text-emerald-100/70">
                Le backend répond, signe les sessions avec JWT et documente le socle DevOps du portfolio.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-8">
          <div className="mb-6 space-y-2">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-rose-300 sm:text-sm sm:tracking-[0.3em]">
              Authentification
            </p>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Connexion</h2>
            <p className="text-sm leading-6 text-slate-400">
              Session protégée pour gérer les projets.
            </p>
          </div>

          {error ? (
            <div className="mb-4 rounded-lg border border-red-800 bg-red-950/30 px-4 py-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-slate-300">Email</label>
              <input
                type="email"
                placeholder="devops@test.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-cyan-300"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Mot de passe
              </label>
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-cyan-300"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-rose-500 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Connexion en cours..." : "Ouvrir la console"}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-800 pt-5">
            <Link
              to="/projets"
              className="text-sm text-slate-400 transition-colors hover:text-cyan-200"
            >
              Voir les projets publics
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
