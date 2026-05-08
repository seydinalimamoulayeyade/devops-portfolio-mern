import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function getHomeLinkClass({ isActive }) {
  return `inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
    isActive
      ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
      : "text-slate-300 hover:text-rose-400 hover:bg-white/5"
  }`;
}

export default function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-6">
        <Link
          to="/"
          className="font-mono text-sm font-semibold tracking-[0.2em] text-rose-400 hover:opacity-90 transition-opacity"
        >
          &lt;SLLY /&gt;
        </Link>

        <div className="hidden md:flex items-center gap-2">
          <NavLink to="/" end className={getHomeLinkClass}>
            Accueil
          </NavLink>

          <NavLink
            to="/projets"
            className={({ isActive }) =>
              `inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  : "text-slate-300 hover:text-rose-400 hover:bg-white/5"
              }`
            }
          >
            Projets
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/ajouter"
              className={({ isActive }) =>
                `inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    : "text-slate-300 hover:text-rose-400 hover:bg-white/5"
                }`
              }
            >
              Ajouter
            </NavLink>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {!isAuthenticated ? (
            <Link
              to="/login"
              className="inline-flex items-center rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:border-rose-400 hover:text-rose-400"
            >
              Connexion
            </Link>
          ) : (
            <button
              onClick={logout}
              className="inline-flex items-center rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose-600"
            >
              Déconnexion
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
