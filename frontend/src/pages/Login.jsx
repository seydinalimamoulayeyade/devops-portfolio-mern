import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
    <section className="motion-fade-up mx-auto mt-16 max-w-md rounded-lg border border-slate-800 bg-slate-900/85 p-8 shadow-sm">
      <div className="mb-6 space-y-2 text-center">
        <p className="text-sm font-mono uppercase tracking-[0.3em] text-rose-300">
          Authentification
        </p>
        <h1 className="text-3xl font-bold text-white">Connexion</h1>
        <p className="text-sm leading-6 text-slate-400">
          Connectez-vous pour gérer les projets protégés par JWT.
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
            placeholder="admin@test.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-rose-400"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">Mot de passe</label>
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-rose-400"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-rose-500 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Connexion en cours..." : "Se connecter"}
        </button>
      </form>
    </section>
  );
}
