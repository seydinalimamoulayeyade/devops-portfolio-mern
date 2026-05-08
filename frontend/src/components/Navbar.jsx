import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function getNavLinkClass({ isActive }) {
  return `inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
    isActive
      ? "border border-rose-400/25 bg-rose-500/10 text-rose-300"
      : "text-slate-300 hover:bg-white/5 hover:text-white"
  }`;
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  function handleLogout() {
    logout();
    setMenuOpen(false);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-6">
        <Link
          to="/"
          onClick={closeMenu}
          className="font-mono text-sm font-semibold tracking-[0.2em] text-rose-300 transition-opacity hover:opacity-90"
        >
          &lt;SLLY /&gt;
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <NavLink to="/" end className={getNavLinkClass}>
            Accueil
          </NavLink>
          <NavLink to="/projets" className={getNavLinkClass}>
            Projets
          </NavLink>
          {isAuthenticated ? (
            <NavLink to="/ajouter" className={getNavLinkClass}>
              Ajouter
            </NavLink>
          ) : null}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {!isAuthenticated ? (
            <Link
              to="/login"
              className="inline-flex items-center rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:border-rose-400 hover:text-white"
            >
              Connexion
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center rounded-lg bg-rose-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose-600"
            >
              Déconnexion
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-700 text-slate-200 transition-colors hover:border-rose-400 hover:text-white md:hidden"
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
        >
          <span className="flex h-5 w-5 flex-col justify-center gap-1.5">
            <span
              className={`h-0.5 w-5 rounded-full bg-current transition-transform ${
                menuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-5 rounded-full bg-current transition-opacity ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`h-0.5 w-5 rounded-full bg-current transition-transform ${
                menuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {menuOpen ? (
        <div className="motion-fade-up border-t border-slate-800 bg-slate-950 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-5">
            <NavLink to="/" end onClick={closeMenu} className={getNavLinkClass}>
              Accueil
            </NavLink>
            <NavLink to="/projets" onClick={closeMenu} className={getNavLinkClass}>
              Projets
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/ajouter" onClick={closeMenu} className={getNavLinkClass}>
                  Ajouter
                </NavLink>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center rounded-lg bg-rose-500 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-rose-600"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition-colors hover:border-rose-400 hover:text-white"
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </nav>
  );
}
