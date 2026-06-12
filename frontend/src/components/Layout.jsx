import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-slate-950 text-slate-100">
      <div className="app-grid pointer-events-none fixed inset-0 opacity-80" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}
