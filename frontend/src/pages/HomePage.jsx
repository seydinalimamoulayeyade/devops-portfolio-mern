import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RevealSection from "../components/RevealSection";
import { getAllProjects, getImageUrl } from "../services/projetService";

const stackItems = [
  ["DevOps", "Docker, Jenkins, Kubernetes, Terraform."],
  ["AWS", "Déploiement et services cloud orientés production."],
  ["Dev", "MERN, Laravel et Tailwind pour livrer vite."],
];

const pipelineSteps = ["Code", "Docker", "Compose", "Run"];

const dockerHighlights = [
  ["Services MERN", "Frontend React, API Express et MongoDB orchestrés avec Docker Compose.", "service"],
  ["Images Docker Hub", "Images frontend/backend publiées pour montrer la couche containerisation.", "registry"],
  ["Roadmap claire", "Jenkins, SonarQube, Trivy, Kubernetes, Terraform et monitoring viendront progressivement.", "release"],
];

const profileLinks = [
  ["GitHub", "https://github.com/seydinalimamoulayeyade", "Code source"],
  ["Docker Hub", "https://hub.docker.com/u/lims4", "Images publiées"],
  ["CV", "/cv-seydina-yade.html", "Version web"],
];

const experienceItems = [
  ["Formation", "Cloud AWS & DevOps - Orange Digital Center", "Docker aujourd'hui, puis CI/CD, Kubernetes, Terraform, monitoring et sécurité applicative."],
  ["Projet fil rouge", "Portfolio MERN containerisé", "Application fullstack utilisée comme support progressif pour les prochaines couches DevOps."],
  ["Orientation", "DevOps orienté delivery", "Construire proprement, documenter les étapes et intégrer les outils sans brûler les phases."],
];

const toolGroups = [
  {
    title: "DevOps",
    tools: [
      ["Docker", "docker"],
      ["Jenkins", "jenkins"],
      ["Kubernetes", "kubernetes"],
      ["Terraform", "terraform"],
    ],
  },
  {
    title: "Qualité & sécurité",
    tools: [
      ["SonarQube", "sonarqube"],
      ["Trivy", "trivy"],
      ["Security", "shield"],
      ["Quality Gate", "quality"],
    ],
  },
  {
    title: "Observabilité",
    tools: [
      ["Prometheus", "prometheus"],
      ["Grafana", "grafana"],
      ["Metrics", "metrics"],
      ["Alerts", "alerts"],
    ],
  },
  {
    title: "Cloud AWS",
    tools: [
      ["AWS", "aws"],
      ["EC2", "compute"],
      ["Storage", "storage"],
      ["Network", "network"],
    ],
  },
  {
    title: "MERN",
    tools: [
      ["MongoDB", "mongodb"],
      ["Express", "express"],
      ["React", "react"],
      ["Node.js", "node"],
    ],
  },
  {
    title: "Web app",
    tools: [
      ["Laravel", "laravel"],
      ["Tailwind", "tailwind"],
      ["API", "api"],
      ["UI", "ui"],
    ],
  },
];

function ToolLogo({ icon }) {
  const commonProps = {
    "aria-hidden": "true",
    className: "h-6 w-6 sm:h-7 sm:w-7",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "1.8",
    viewBox: "0 0 32 32",
  };

  const icons = {
    actions: (
      <svg {...commonProps}>
        <path d="M6 9h7l3 4h10" />
        <path d="M6 23h7l3-4h10" />
        <circle cx="6" cy="9" r="2.5" />
        <circle cx="6" cy="23" r="2.5" />
        <circle cx="26" cy="16" r="3" />
      </svg>
    ),
    alerts: (
      <svg {...commonProps}>
        <path d="M16 6 5 26h22L16 6Z" />
        <path d="M16 13v6" />
        <path d="M16 23h.01" />
      </svg>
    ),
    api: (
      <svg {...commonProps}>
        <path d="M8 11h16v10H8z" />
        <path d="M4 16h4M24 16h4" />
        <path d="M12 14v4M16 14v4M20 14v4" />
      </svg>
    ),
    aws: (
      <svg {...commonProps}>
        <path d="M8 12 16 7l8 5v9l-8 5-8-5v-9Z" />
        <path d="M10 22c4 3 8 3 12 0" />
        <path d="M12 15h8" />
      </svg>
    ),
    azure: (
      <svg {...commonProps}>
        <path d="m15 5-8 21h7l11-21h-10Z" />
        <path d="m16 18 5 8h-9" />
      </svg>
    ),
    build: (
      <svg {...commonProps}>
        <path d="m19 8 5 5-11 11H8v-5L19 8Z" />
        <path d="m17 10 5 5" />
      </svg>
    ),
    cluster: (
      <svg {...commonProps}>
        <circle cx="16" cy="16" r="4" />
        <circle cx="8" cy="9" r="3" />
        <circle cx="24" cy="9" r="3" />
        <circle cx="8" cy="24" r="3" />
        <circle cx="24" cy="24" r="3" />
        <path d="m10 11 4 3m8-3-4 3m-4 5-4 3m8-3 4 3" />
      </svg>
    ),
    compute: (
      <svg {...commonProps}>
        <rect x="7" y="8" width="18" height="14" rx="2" />
        <path d="M10 12h12M10 18h5" />
        <path d="M12 25h8" />
      </svg>
    ),
    docker: (
      <svg {...commonProps}>
        <path d="M6 18h20c-1 5-4 8-10 8-5 0-8-2-10-8Z" />
        <path d="M9 10h4v4H9zM14 10h4v4h-4zM19 10h4v4h-4zM14 5h4v4h-4z" />
      </svg>
    ),
    express: (
      <svg {...commonProps}>
        <path d="M7 10h18" />
        <path d="M7 16h12" />
        <path d="M7 22h18" />
        <path d="m20 13 5 3-5 3" />
      </svg>
    ),
    grafana: (
      <svg {...commonProps}>
        <path d="M16 25c-5 0-9-3-9-8 0-6 5-10 10-10 4 0 8 3 8 7 0 3-2 6-5 6-3 0-5-2-5-4s2-4 4-4" />
        <path d="M19 12c3 1 4 4 2 7" />
      </svg>
    ),
    image: (
      <svg {...commonProps}>
        <rect x="6" y="8" width="20" height="16" rx="2" />
        <path d="M10 19h12M10 14h12" />
      </svg>
    ),
    jenkins: (
      <svg {...commonProps}>
        <circle cx="16" cy="10" r="4" />
        <path d="M10 27v-6c0-3 2.5-5 6-5s6 2 6 5v6" />
        <path d="M12 21h8" />
        <path d="M9 9c1-4 5-6 9-4" />
      </svg>
    ),
    ingress: (
      <svg {...commonProps}>
        <path d="M5 16h10" />
        <path d="m11 12 4 4-4 4" />
        <path d="M17 8h10v16H17z" />
      </svg>
    ),
    kubernetes: (
      <svg {...commonProps}>
        <path d="m16 5 10 6v10l-10 6-10-6V11l10-6Z" />
        <circle cx="16" cy="16" r="3.5" />
        <path d="M16 8v4M16 20v4M8.8 12l3.5 2M19.7 18l3.5 2M23.2 12l-3.5 2M12.3 18l-3.5 2" />
      </svg>
    ),
    laravel: (
      <svg {...commonProps}>
        <path d="M7 8v11l9 5 9-5V8l-9 5-9-5Z" />
        <path d="M7 8l9 5v11" />
        <path d="M25 8 16 13" />
      </svg>
    ),
    logs: (
      <svg {...commonProps}>
        <path d="M9 7h14v18H9z" />
        <path d="M13 12h6M13 16h6M13 20h4" />
      </svg>
    ),
    metrics: (
      <svg {...commonProps}>
        <path d="M7 24V8" />
        <path d="M7 24h18" />
        <path d="m10 19 4-5 4 3 5-8" />
      </svg>
    ),
    mongodb: (
      <svg {...commonProps}>
        <path d="M16 4c5 5 6 10 0 24C10 14 11 9 16 4Z" />
        <path d="M16 11v13" />
      </svg>
    ),
    network: (
      <svg {...commonProps}>
        <circle cx="8" cy="16" r="3" />
        <circle cx="24" cy="9" r="3" />
        <circle cx="24" cy="23" r="3" />
        <path d="m11 15 10-5M11 17l10 5" />
      </svg>
    ),
    node: (
      <svg {...commonProps}>
        <path d="m16 5 10 6v10l-10 6-10-6V11l10-6Z" />
        <path d="M12 19v-6l8 6v-6" />
      </svg>
    ),
    prometheus: (
      <svg {...commonProps}>
        <path d="M16 4c4 4 6 8 6 13a6 6 0 0 1-12 0c0-5 2-9 6-13Z" />
        <path d="M13 21h6" />
        <path d="M16 10v6" />
      </svg>
    ),
    quality: (
      <svg {...commonProps}>
        <path d="M7 17 13 23 25 9" />
        <path d="M7 9h10" />
        <path d="M7 13h7" />
      </svg>
    ),
    registry: (
      <svg {...commonProps}>
        <path d="M8 9h16v14H8z" />
        <path d="M11 13h10M11 17h10M11 21h5" />
      </svg>
    ),
    release: (
      <svg {...commonProps}>
        <path d="M16 5v13" />
        <path d="m10 12 6 6 6-6" />
        <path d="M8 24h16" />
      </svg>
    ),
    runtime: (
      <svg {...commonProps}>
        <path d="M8 8h16v16H8z" />
        <path d="M12 12h8v8h-8z" />
        <path d="M5 12h3M5 20h3M24 12h3M24 20h3" />
      </svg>
    ),
    react: (
      <svg {...commonProps}>
        <circle cx="16" cy="16" r="2.5" />
        <ellipse cx="16" cy="16" rx="11" ry="4.5" />
        <ellipse cx="16" cy="16" rx="11" ry="4.5" transform="rotate(60 16 16)" />
        <ellipse cx="16" cy="16" rx="11" ry="4.5" transform="rotate(120 16 16)" />
      </svg>
    ),
    service: (
      <svg {...commonProps}>
        <path d="M7 9h18v6H7zM7 19h18v4H7z" />
        <path d="M11 12h.01M11 21h.01" />
      </svg>
    ),
    shield: (
      <svg {...commonProps}>
        <path d="M16 5 25 9v7c0 6-4 10-9 12-5-2-9-6-9-12V9l9-4Z" />
        <path d="m12 16 3 3 6-7" />
      </svg>
    ),
    sonarqube: (
      <svg {...commonProps}>
        <path d="M7 22c5-5 11-7 18-7" />
        <path d="M7 16c4-4 9-6 15-6" />
        <path d="M7 10c3-2 6-3 10-3" />
      </svg>
    ),
    storage: (
      <svg {...commonProps}>
        <ellipse cx="16" cy="9" rx="9" ry="4" />
        <path d="M7 9v14c0 2 4 4 9 4s9-2 9-4V9" />
        <path d="M7 16c0 2 4 4 9 4s9-2 9-4" />
      </svg>
    ),
    terminal: (
      <svg {...commonProps}>
        <path d="M6 8h20v16H6z" />
        <path d="m10 13 4 3-4 3" />
        <path d="M16 20h6" />
      </svg>
    ),
    terraform: (
      <svg {...commonProps}>
        <path d="M8 7v8l7 4v-8L8 7Z" />
        <path d="M17 11v8l7-4V7l-7 4Z" />
        <path d="M8 17v8l7 4v-8l-7-4Z" />
      </svg>
    ),
    tailwind: (
      <svg {...commonProps}>
        <path d="M8 18c2-6 6-8 12-4 2 1 3 1 4-1" />
        <path d="M8 24c2-6 6-8 12-4 2 1 3 1 4-1" />
      </svg>
    ),
    tests: (
      <svg {...commonProps}>
        <path d="M12 6h8" />
        <path d="M14 6v7l-6 10c-1 2 0 3 2 3h12c2 0 3-1 2-3l-6-10V6" />
        <path d="M11 20h10" />
      </svg>
    ),
    trivy: (
      <svg {...commonProps}>
        <path d="M16 5 25 9v7c0 6-4 10-9 12-5-2-9-6-9-12V9l9-4Z" />
        <path d="M11 12h10" />
        <path d="M12 16h7" />
        <path d="M13 20h4" />
      </svg>
    ),
    ui: (
      <svg {...commonProps}>
        <rect x="6" y="8" width="20" height="16" rx="2" />
        <path d="M6 13h20" />
        <path d="M10 18h5M10 21h9" />
      </svg>
    ),
  };

  return icons[icon] || icons.terminal;
}

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
          ["Docker", "socle"],
          ["API", "Express"],
          ["Mongo", "data"],
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
          <span>docker.compose</span>
          <span className="text-emerald-300">green</span>
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
    <div className="space-y-8 pb-10 sm:space-y-16 sm:pb-12 lg:space-y-20">
      <RevealSection>
        <section className="relative isolate overflow-hidden rounded-lg border border-slate-800 px-4 py-8 shadow-2xl shadow-slate-950/40 sm:px-8 sm:py-16 lg:min-h-[520px] lg:px-10">
          <div
            className="motion-hero-bg absolute inset-0 -z-20 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/dashboard-monitoring.jpg')" }}
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/45" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center">
            <div className="max-w-3xl space-y-5 sm:space-y-8">
              <div className="space-y-3 sm:space-y-5">
                <p className="motion-fade-up text-xs font-mono uppercase tracking-[0.2em] text-cyan-300 sm:text-sm sm:tracking-[0.3em]">
                  Cloud / DevOps / Fullstack
                </p>
                <h1
                  className="motion-fade-up max-w-3xl text-[1.65rem] font-bold leading-[1.12] text-white sm:text-4xl sm:leading-tight lg:text-5xl"
                  style={{ "--motion-delay": "90ms" }}
                >
                  Je conçois, automatise et déploie des applications prêtes pour le cloud.
                </h1>
                <p
                  className="motion-fade-up max-w-2xl text-sm leading-6 text-slate-300 sm:text-lg sm:leading-8"
                  style={{ "--motion-delay": "180ms" }}
                >
                  Développeur DevOps orienté AWS, je consolide aujourd'hui une base MERN dockerisée, puis j'intègre progressivement Jenkins, Kubernetes, Terraform et les outils de qualité.
                </p>
              </div>

              <div
                className="motion-fade-up flex flex-wrap gap-3 sm:gap-4"
                style={{ "--motion-delay": "260ms" }}
              >
                <Link
                  to="/projets"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-rose-500 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-rose-600 sm:w-auto sm:px-6"
                >
                  Voir mes projets
                </Link>
                <a
                  href="#contact"
                  className="inline-flex w-full items-center justify-center rounded-lg border border-white/20 px-5 py-3 text-sm font-medium text-slate-100 transition-colors hover:border-cyan-300 hover:text-cyan-200 sm:w-auto sm:px-6"
                >
                  Discuter d'un déploiement
                </a>
              </div>

              <div
                className="motion-fade-up flex flex-wrap gap-2"
                style={{ "--motion-delay": "310ms" }}
              >
                {profileLinks.map(([label, href, detail]) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-slate-950/55 px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-cyan-300/40 hover:text-white"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                    {label}
                    <span className="hidden text-slate-500 sm:inline">{detail}</span>
                  </a>
                ))}
              </div>

              <div className="grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-3 sm:gap-4 sm:pt-6">
                {stackItems.map(([title, text], index) => (
                  <div
                    key={title}
                    className="motion-fade-up"
                    style={{ "--motion-delay": `${340 + index * 90}ms` }}
                  >
                    <p className="text-xl font-bold text-white sm:text-2xl">{title}</p>
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
        <section className="glass-panel rounded-lg p-4 sm:p-6">
          <div className="flex flex-col gap-4 border-b border-slate-800 pb-5 sm:pb-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-300 sm:text-sm sm:tracking-[0.3em]">
                Outils Cloud & DevOps
              </p>
              <h2 className="text-balance text-xl font-bold leading-tight text-white sm:text-3xl">
                Une boîte à outils centrée DevOps, AWS et développement web.
              </h2>
              <p className="text-sm leading-7 text-slate-400">
                Mon socle actuel : automatiser, sécuriser, observer et livrer des applications cloud-ready.
              </p>
            </div>

            <span className="inline-flex w-fit items-center rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300">
              Cloud-ready
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {toolGroups.map(({ title, tools }, index) => (
              <div
                key={title}
                className="motion-hover-lift motion-fade-up rounded-lg border border-slate-800 bg-slate-950/55 p-3.5 hover:border-cyan-300/35 sm:p-5"
                style={{ "--motion-delay": `${index * 70}ms` }}
              >
                <p className="text-base font-semibold text-white sm:text-lg">{title}</p>
                <div className="mt-4 grid grid-cols-4 gap-2 sm:mt-5 sm:gap-3">
                  {tools.map(([name, icon]) => (
                    <span
                      key={name}
                      title={name}
                      aria-label={name}
                      tabIndex={0}
                      className="group/tool relative flex aspect-square items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-cyan-200 transition-all hover:-translate-y-1 hover:border-cyan-300/50 hover:bg-cyan-300/10 hover:text-white focus-visible:border-cyan-300/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/25"
                    >
                      <ToolLogo icon={icon} />
                      <span className="sr-only">{name}</span>
                      <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-medium text-slate-100 opacity-0 shadow-xl shadow-slate-950/40 transition-opacity group-hover/tool:opacity-100 group-focus-visible/tool:opacity-100 sm:block">
                        {name}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      <RevealSection>
        <section className="grid gap-6 border-t border-slate-800 pt-10 sm:gap-8 sm:pt-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="space-y-4">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-300 sm:text-sm sm:tracking-[0.3em]">
              Dockerisation actuelle
            </p>
            <h2 className="text-xl font-bold leading-tight text-white sm:text-3xl">
              La preuve concrète actuelle reste Docker.
            </h2>
            <p className="text-sm leading-7 text-slate-400">
              Le reste de la stack DevOps est affiché comme compétence et trajectoire. Pour le moment, le projet démontre surtout la séparation des services et la publication d'images.
            </p>
          </div>

          <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
            {dockerHighlights.map(([title, text, icon], index) => (
              <article
                key={title}
                className="motion-hover-lift motion-fade-up rounded-lg border border-slate-800 bg-slate-900/80 p-4 hover:border-cyan-300/40 sm:p-5"
                style={{ "--motion-delay": `${index * 90}ms` }}
              >
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
                  <ToolLogo icon={icon} />
                </span>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{text}</p>
              </article>
            ))}
          </div>
        </section>
      </RevealSection>

      <RevealSection>
        <section className="grid gap-6 border-t border-slate-800 pt-10 sm:gap-8 sm:pt-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="space-y-4">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-rose-300 sm:text-sm sm:tracking-[0.3em]">
              Parcours
            </p>
            <h2 className="text-xl font-bold leading-tight text-white sm:text-3xl">
              Une progression DevOps étape par étape.
            </h2>
          </div>

          <div className="grid gap-3">
            {experienceItems.map(([type, title, text], index) => (
              <article
                key={title}
                className="motion-fade-up rounded-lg border border-slate-800 bg-slate-900/80 p-4"
                style={{ "--motion-delay": `${index * 80}ms` }}
              >
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-300">
                  {type}
                </p>
                <h3 className="mt-2 text-base font-semibold text-white">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-400">{text}</p>
              </article>
            ))}
          </div>
        </section>
      </RevealSection>

      <RevealSection>
        <section className="space-y-6 border-t border-slate-800 pt-10 sm:space-y-8 sm:pt-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-rose-300 sm:text-sm sm:tracking-[0.3em]">
                Portfolio
              </p>
              <h2 className="text-xl font-bold text-white sm:text-3xl">Projets en vedette</h2>
              <p className="max-w-2xl text-sm leading-7 text-slate-400">
                Un aperçu de mes réalisations récentes, construites autour du MERN, de Laravel, de Tailwind, du DevOps et d'AWS.
              </p>
            </div>

            <Link
              to="/projets"
              className="inline-flex w-full items-center justify-center rounded-lg border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition-colors hover:border-rose-400 hover:text-white sm:w-auto"
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
            <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-6 text-center sm:p-10">
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
        <section id="contact" className="border-t border-slate-800 pt-10 sm:pt-16">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-rose-300 sm:text-sm sm:tracking-[0.3em]">
                Contact
              </p>
              <h2 className="text-xl font-bold leading-tight text-white sm:text-3xl">
                Besoin d'un développeur Cloud & DevOps pour un projet ?
              </h2>
              <p className="max-w-2xl text-sm leading-8 text-slate-400">
                Je peux contribuer à une application MERN ou Laravel, renforcer sa conteneurisation Docker et préparer les prochaines étapes : Jenkins, SonarQube, Trivy, Kubernetes, Terraform et AWS.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 lg:justify-end">
              <a
                href="mailto:seydinalimamoulayeyade@gmail.com"
                className="inline-flex w-full items-center justify-center rounded-lg bg-rose-500 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-rose-600 sm:w-auto sm:px-6"
              >
                Envoyer un email
              </a>
              <Link
                to="/projets"
                className="inline-flex w-full items-center justify-center rounded-lg border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition-colors hover:border-rose-400 hover:text-white sm:w-auto sm:px-6"
              >
                Explorer les projets
              </Link>
              <a
                href="/cv-seydina-yade.html"
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center rounded-lg border border-cyan-300/30 px-5 py-3 text-sm font-medium text-cyan-200 transition-colors hover:border-cyan-300 hover:text-white sm:w-auto sm:px-6"
              >
                Voir le CV
              </a>
            </div>
          </div>
        </section>
      </RevealSection>
    </div>
  );
}
