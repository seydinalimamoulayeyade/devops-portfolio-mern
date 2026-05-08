import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RevealSection from "../components/RevealSection";
import { getAllProjects, getImageUrl } from "../services/projetService";

const stackItems = [
  ["React", "Interfaces rapides, responsive et maintenables."],
  ["Express", "API REST claire, structurée et sécurisée."],
  ["MongoDB", "Persistance flexible pour des données évolutives."],
];

const skillItems = [
  ["Cloud & DevOps", "CI/CD, déploiement, supervision, bonnes pratiques"],
  ["Frontend", "React, Vite, Tailwind, UI responsive"],
  ["Backend", "Node.js, Express, API REST, JWT"],
  ["Données", "MongoDB, Mongoose, modélisation"],
];

const approachItems = [
  "Pipeline CI/CD pour livrer vite et proprement",
  "Déploiement cloud-ready avec séparation frontend/API",
  "Authentification JWT et parcours protégés",
  "Architecture fullstack prête à évoluer",
];

const pipelineSteps = ["Build", "Test", "Image", "Deploy"];

const deliveryItems = [
  ["Plan", "Cadrer le besoin et les dépendances techniques"],
  ["Ship", "Automatiser build, tests et livraison"],
  ["Run", "Surveiller, corriger et améliorer en continu"],
];

function CloudDevOpsMotionPanel() {
  return (
    <div className="motion-float motion-scan hidden rounded-lg border border-white/10 bg-slate-950/70 p-5 shadow-2xl shadow-slate-950/50 backdrop-blur lg:block">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.28em] text-cyan-300">
            Deploy flow
          </p>
          <p className="mt-1 text-lg font-semibold text-white">
            Cloud release pipeline
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-medium text-emerald-300">
          <span className="motion-status-dot h-2 w-2 rounded-full bg-current text-emerald-300" />
          Live
        </div>
      </div>

      <div className="relative py-6">
        <div className="motion-pipeline-line absolute left-8 right-8 top-[42px] h-px bg-slate-700" />
        <div className="relative grid grid-cols-4 gap-3">
          {pipelineSteps.map((step, index) => (
            <div
              key={step}
              className="motion-fade-up text-center"
              style={{ "--motion-delay": `${index * 120}ms` }}
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-sm font-semibold text-cyan-200">
                {index + 1}
              </div>
              <p className="mt-3 text-xs font-medium text-slate-200">{step}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 border-y border-white/10 py-4">
        {[
          ["99.9%", "uptime cible"],
          ["JWT", "auth"],
          ["CI/CD", "release"],
        ].map(([value, label], index) => (
          <div
            key={label}
            className="motion-fade-up"
            style={{ "--motion-delay": `${380 + index * 100}ms` }}
          >
            <p className="text-lg font-bold text-white">{value}</p>
            <p className="mt-1 text-xs text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-3 font-mono text-xs text-slate-400">
        <div className="flex items-center justify-between">
          <span>container.build</span>
          <span className="text-emerald-300">passed</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
          <div className="motion-pipeline-line h-full w-full bg-slate-700" />
        </div>
        <div className="flex h-24 items-end gap-2 border-t border-white/10 pt-4">
          {[44, 72, 58, 88, 66, 96, 78].map((height, index) => (
            <span
              key={`${height}-${index}`}
              className="motion-meter flex-1 rounded-t bg-cyan-300/70"
              style={{
                height: `${height}%`,
                "--motion-delay": `${index * 130}ms`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FeaturedProjectCard({ project }) {
  const projectId = project._id || project.id;
  const imageSrc = getImageUrl(project.image);

  return (
    <article className="motion-hover-lift group overflow-hidden rounded-lg border border-slate-800 bg-slate-900/90 transition-all duration-300 hover:border-rose-400/60">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-800">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={project.libelle}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            Aucune image disponible
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <p className="text-xs font-mono uppercase tracking-[0.22em] text-cyan-300/80">
            Projet
          </p>
          <h3 className="text-xl font-semibold text-white">
            {project.libelle}
          </h3>
          <p className="line-clamp-3 text-sm leading-6 text-slate-400">
            {project.description || "Aucune description disponible."}
          </p>
        </div>

        <Link
          to={`/projets/${projectId}`}
          className="inline-flex text-sm font-medium text-rose-300 transition-colors hover:text-rose-200"
        >
          Voir le projet &rarr;
        </Link>
      </div>
    </article>
  );
}

export default function HomePage() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    async function loadFeaturedProjects() {
      try {
        const data = await getAllProjects();
        setFeaturedProjects(data.slice(0, 3));
      } catch (error) {
        console.error("Impossible de charger les projets en vedette :", error);
        setFeaturedProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    }

    loadFeaturedProjects();
  }, []);

  return (
    <div className="space-y-20 pb-12">
      <RevealSection>
        <section className="relative isolate overflow-hidden rounded-lg border border-slate-800 px-6 py-16 shadow-2xl shadow-slate-950/40 sm:px-10 sm:py-20 lg:min-h-[590px] lg:px-12">
          <div
            className="motion-hero-bg absolute inset-0 -z-20 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/dashboard-monitoring.jpg')" }}
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/45" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center">
            <div className="max-w-3xl space-y-8">
              <div className="space-y-5">
                <p className="motion-fade-up text-sm font-mono uppercase tracking-[0.3em] text-cyan-300">
                  Cloud / DevOps / Fullstack
                </p>
                <h1
                  className="motion-fade-up max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl"
                  style={{ "--motion-delay": "90ms" }}
                >
                  Je conçois, automatise et déploie des applications prêtes pour le cloud.
                </h1>
                <p
                  className="motion-fade-up max-w-2xl text-base leading-8 text-slate-300 sm:text-lg"
                  style={{ "--motion-delay": "180ms" }}
                >
                  Développeur Cloud & DevOps, je construis des interfaces React, des API Express et des workflows de livraison pensés pour la fiabilité, la sécurité et le déploiement continu.
                </p>
              </div>

              <div
                className="motion-fade-up flex flex-wrap gap-4"
                style={{ "--motion-delay": "260ms" }}
              >
                <Link
                  to="/projets"
                  className="inline-flex items-center rounded-lg bg-rose-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-rose-600"
                >
                  Voir mes projets
                </Link>
                <a
                  href="#contact"
                  className="inline-flex items-center rounded-lg border border-white/20 px-6 py-3 text-sm font-medium text-slate-100 transition-colors hover:border-cyan-300 hover:text-cyan-200"
                >
                  Discuter d'un déploiement
                </a>
              </div>

              <div className="grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
                {stackItems.map(([title, text], index) => (
                  <div
                    key={title}
                    className="motion-fade-up"
                    style={{ "--motion-delay": `${340 + index * 90}ms` }}
                  >
                    <p className="text-2xl font-bold text-white">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <CloudDevOpsMotionPanel />
          </div>
        </section>
      </RevealSection>

      <RevealSection>
        <section className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="space-y-4">
            <p className="text-sm font-mono uppercase tracking-[0.3em] text-rose-300">
              Stack actuelle
            </p>
            <h2 className="text-3xl font-bold text-white">
              Une base fullstack propre, sécurisée et cloud-ready.
            </h2>
            <p className="text-sm leading-7 text-slate-400">
              L'interface sert de vitrine, mais aussi de socle technique complet pour gérer des projets, authentifier un utilisateur et connecter une API prête à être livrée.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {approachItems.map((item, index) => (
              <div
                key={item}
                className="motion-hover-lift motion-fade-up rounded-lg border border-slate-800 bg-slate-900/80 p-5 text-sm leading-7 text-slate-300 hover:border-cyan-300/40"
                style={{ "--motion-delay": `${index * 80}ms` }}
              >
                {item}
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      <RevealSection>
        <section className="grid gap-8 border-t border-slate-800 pt-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="space-y-4">
            <p className="text-sm font-mono uppercase tracking-[0.3em] text-cyan-300">
              Cycle DevOps
            </p>
            <h2 className="text-3xl font-bold text-white">
              Du code au cloud, chaque étape doit être lisible.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {deliveryItems.map(([title, text], index) => (
              <div
                key={title}
                className="motion-hover-lift motion-fade-up rounded-lg border border-slate-800 bg-slate-900/80 p-5 hover:border-rose-400/40"
                style={{ "--motion-delay": `${index * 110}ms` }}
              >
                <div className="mb-5 h-1 overflow-hidden rounded-full bg-slate-800">
                  <div className="motion-pipeline-line h-full w-full bg-slate-700" />
                </div>
                <p className="text-lg font-semibold text-white">{title}</p>
                <p className="mt-3 text-sm leading-7 text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      <RevealSection>
        <section id="about" className="grid gap-8 border-t border-slate-800 pt-16 lg:grid-cols-2 lg:items-start">
          <div className="space-y-4">
            <p className="text-sm font-mono uppercase tracking-[0.3em] text-rose-300">
              À propos
            </p>
            <h2 className="text-3xl font-bold text-white">
              Un profil orienté pratique, produit et déploiement.
            </h2>
          </div>

          <div className="space-y-4 text-slate-400 leading-8">
            <p>
              Je développe des applications web complètes avec une attention particulière portée à l'architecture, à l'expérience utilisateur et à la sécurité.
            </p>
            <p>
              Mon objectif est de produire des interfaces élégantes, des API robustes et des solutions prêtes à évoluer vers des environnements cloud et DevOps.
            </p>
          </div>
        </section>
      </RevealSection>

      <RevealSection>
        <section id="competences" className="space-y-8">
          <div className="space-y-3">
            <p className="text-sm font-mono uppercase tracking-[0.3em] text-rose-300">
              Compétences
            </p>
            <h2 className="text-3xl font-bold text-white">
              Technologies et domaines que je mobilise.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {skillItems.map(([title, text], index) => (
              <div
                key={title}
                className="motion-hover-lift motion-fade-up rounded-lg border border-slate-800 bg-slate-900/80 p-5 hover:border-cyan-300/40"
                style={{ "--motion-delay": `${index * 80}ms` }}
              >
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      <RevealSection>
        <section className="space-y-8 border-t border-slate-800 pt-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <p className="text-sm font-mono uppercase tracking-[0.3em] text-rose-300">
                Portfolio
              </p>
              <h2 className="text-3xl font-bold text-white">Projets en vedette</h2>
              <p className="max-w-2xl text-sm leading-7 text-slate-400">
                Un aperçu de mes réalisations récentes, construites autour du fullstack moderne, de l'UX, du cloud et de l'architecture d'API.
              </p>
            </div>

            <Link
              to="/projets"
              className="inline-flex items-center rounded-lg border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition-colors hover:border-rose-400 hover:text-white"
            >
              Voir tous les projets
            </Link>
          </div>

          {loadingProjects ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-80 animate-pulse rounded-lg border border-slate-800 bg-slate-900"
                />
              ))}
            </div>
          ) : featuredProjects.length === 0 ? (
            <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-10 text-center">
              <p className="text-sm text-slate-400">
                Aucun projet en vedette pour le moment. Ajoutez-en un depuis l'espace de gestion.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <FeaturedProjectCard key={project._id || project.id} project={project} />
              ))}
            </div>
          )}
        </section>
      </RevealSection>

      <RevealSection>
        <section id="contact" className="border-t border-slate-800 pt-16">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-sm font-mono uppercase tracking-[0.3em] text-rose-300">
                Contact
              </p>
              <h2 className="text-3xl font-bold text-white">
                Besoin d'un développeur Cloud & DevOps pour un projet ?
              </h2>
              <p className="max-w-2xl text-sm leading-8 text-slate-400">
                Je peux contribuer à la conception d'une interface moderne, d'une API sécurisée ou à la structuration technique d'un projet web orienté cloud, CI/CD et déploiement.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 lg:justify-end">
              <a
                href="mailto:seydinalimamoulayeyade@gmail.com"
                className="inline-flex items-center rounded-lg bg-rose-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-rose-600"
              >
                Envoyer un email
              </a>
              <Link
                to="/projets"
                className="inline-flex items-center rounded-lg border border-slate-700 px-6 py-3 text-sm font-medium text-slate-300 transition-colors hover:border-rose-400 hover:text-white"
              >
                Explorer les projets
              </Link>
            </div>
          </div>
        </section>
      </RevealSection>
    </div>
  );
}
