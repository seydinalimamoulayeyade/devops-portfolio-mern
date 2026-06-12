import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/useAuth";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, isAdmin, logout } = useAuth();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/projets" },
    ...(isAdmin ? [{ name: "Add Project", href: "/ajouter" }] : []),
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-purple-500/10 bg-slate-900/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 font-bold text-white shadow-lg shadow-purple-500/50 transition-transform group-hover:scale-110">
              SY
            </div>
            <span className="hidden text-lg font-bold text-white sm:block">
              Seydina <span className="gradient-text">Yade</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-purple-400"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500" />
                )}
              </Link>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden items-center gap-3 md:flex">
            {isAdmin && (
              <span className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Admin
              </span>
            )}
            
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition-colors hover:border-red-500/60 hover:bg-red-500/20"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/50 transition-transform hover:scale-105"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-2 text-purple-300 md:hidden"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t border-purple-500/10 py-4 md:hidden">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-purple-500/20 text-purple-300"
                      : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-center text-xs font-semibold text-emerald-300">
                      Admin Access
                    </div>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
