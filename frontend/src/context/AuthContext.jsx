import { useMemo, useState } from "react";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  function login(nextToken) {
    localStorage.setItem("token", nextToken);
    setToken(nextToken);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken("");
  }

  const value = useMemo(
    () => ({ token, isAuthenticated: Boolean(token), login, logout }),
    [token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
