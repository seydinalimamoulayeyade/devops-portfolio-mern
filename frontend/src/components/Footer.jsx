import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navigation = {
    main: [
      { name: "Home", href: "/" },
      { name: "Projects", href: "/projets" },
      { name: "Login", href: "/login" },
    ],
    social: [
      {
        name: "GitHub",
        href: "https://github.com/seydinalimamoulayeyade",
        icon: (
          <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
        ),
      },
      {
        name: "Docker Hub",
        href: "https://hub.docker.com/u/lims4",
        icon: (
          <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
            <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338 0-.676.03-1.01.087-.239-1.232-.994-2.223-2.211-2.777-.124-.062-.251-.046-.331.043-.552.644-.766 1.588-.639 2.533.076.552.286 1.07.645 1.53a3.97 3.97 0 01-1.048.135H.145a.143.143 0 00-.144.144c0 1.726.37 3.335 1.098 4.786.668 1.344 1.607 2.402 2.792 3.146 1.389.878 3.325 1.324 5.748 1.324 1.076 0 2.16-.107 3.225-.318a12.87 12.87 0 003.204-1.092 10.73 10.73 0 002.715-2.048 11.45 11.45 0 002.08-3.164l.072-.16c.558.032 1.717-.043 2.522-.688.404-.324.72-.73.959-1.203.036-.067.017-.16-.05-.213z"/>
          </svg>
        ),
      },
      {
        name: "LinkedIn",
        href: "https://linkedin.com/in/seydinalimamoulayeyade",
        icon: (
          <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        ),
      },
      {
        name: "Email",
        href: "mailto:seydinalimamoulayeyade@gmail.com",
        icon: (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        ),
      },
    ],
    technologies: [
      { name: "Docker", count: "Containerization" },
      { name: "Jenkins", count: "CI/CD" },
      { name: "Kubernetes", count: "Orchestration" },
      { name: "Terraform", count: "IaC" },
      { name: "AWS", count: "Cloud" },
    ],
  };

  return (
    <footer className="border-t border-purple-500/10 bg-slate-900/60 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8 lg:px-10 lg:py-16">
        {/* Main footer content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Brand column */}
          <div className="space-y-4">
            <Link to="/" className="group inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 font-bold text-white shadow-lg shadow-purple-500/50 transition-transform group-hover:scale-110">
                SY
              </div>
              <div>
                <div className="text-lg font-bold text-white">
                  Seydina <span className="gradient-text">Yade</span>
                </div>
                <div className="text-sm text-slate-400">DevOps Engineer</div>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Building reliable, scalable cloud infrastructure with modern DevOps practices.
              Specializing in Docker, Kubernetes, and AWS.
            </p>
            
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-sm font-semibold text-emerald-300">Available for work</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-sm text-slate-400 transition-colors hover:text-purple-400"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="mb-4 mt-8 text-sm font-semibold uppercase tracking-wider text-white">
              Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {navigation.technologies.map((tech) => (
                <span
                  key={tech.name}
                  className="rounded-md border border-slate-700/50 bg-slate-800/50 px-3 py-1 text-xs font-medium text-slate-300"
                  title={tech.count}
                >
                  {tech.name}
                </span>
              ))}
            </div>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Connect
            </h3>
            <div className="flex gap-4">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700/50 bg-slate-800/50 text-slate-400 transition-all hover:border-purple-500/50 hover:bg-purple-500/10 hover:text-purple-400"
                  aria-label={item.name}
                >
                  {item.icon}
                </a>
              ))}
            </div>

            <div className="mt-8 space-y-4">
              <div>
                <h4 className="mb-2 text-sm font-semibold text-white">Email</h4>
                <a
                  href="mailto:seydinalimamoulayeyade@gmail.com"
                  className="text-sm text-slate-400 hover:text-purple-400"
                >
                  seydinalimamoulayeyade@gmail.com
                </a>
              </div>
              
              <div>
                <h4 className="mb-2 text-sm font-semibold text-white">Location</h4>
                <p className="text-sm text-slate-400">Senegal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 border-t border-purple-500/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-slate-400">
              © {currentYear} Seydina Limamou Laye Yade. All rights reserved.
            </p>
            
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                Built with
                <span className="text-red-400">♥</span>
                using
                <span className="font-semibold text-cyan-400">React</span>
                +
                <span className="font-semibold text-purple-400">Tailwind</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
