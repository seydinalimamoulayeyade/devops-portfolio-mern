import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden px-4 py-16 sm:px-8 sm:py-24 lg:px-10 lg:py-32">
      {/* Animated background gradient blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-1/4 top-0 h-[500px] w-[500px] animate-[float-gentle_20s_ease-in-out_infinite] rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute -right-1/4 top-1/4 h-[600px] w-[600px] animate-[float-gentle_25s_ease-in-out_infinite_reverse] rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] animate-[float-gentle_30s_ease-in-out_infinite] rounded-full bg-emerald-500/20 blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div className="app-grid absolute inset-0 -z-10" />

      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Left content */}
          <div className="space-y-8">
            {/* Badge */}
            <div
              className="motion-fade-up inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 backdrop-blur-sm"
              style={{ "--motion-delay": "0ms" }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-sm font-medium text-purple-200">
                Available for DevOps projects
              </span>
            </div>

            {/* Main heading */}
            <h1
              className="motion-fade-up text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl"
              style={{ "--motion-delay": "100ms" }}
            >
              Building{" "}
              <span className="gradient-text">Cloud-Native</span>{" "}
              Applications
            </h1>

            {/* Description */}
            <p
              className="motion-fade-up max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl"
              style={{ "--motion-delay": "200ms" }}
            >
              DevOps Engineer specializing in{" "}
              <span className="font-semibold text-cyan-400">Docker</span>,{" "}
              <span className="font-semibold text-purple-400">Kubernetes</span>,{" "}
              <span className="font-semibold text-emerald-400">Terraform</span>{" "}
              and AWS cloud infrastructure.
            </p>

            {/* Stats */}
            <div
              className="motion-fade-up grid grid-cols-3 gap-6"
              style={{ "--motion-delay": "300ms" }}
            >
              {[
                ["5+", "Modules", "DevOps"],
                ["80%", "Coverage", "Tests"],
                ["100%", "Success", "CI/CD"],
              ].map(([value, label, sublabel]) => (
                <div key={label} className="space-y-1">
                  <div className="text-3xl font-bold text-white">{value}</div>
                  <div className="text-sm font-medium text-slate-300">{label}</div>
                  <div className="text-xs text-slate-500">{sublabel}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div
              className="motion-fade-up flex flex-wrap gap-4"
              style={{ "--motion-delay": "400ms" }}
            >
              <Link
                to="/projets"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 font-semibold text-white shadow-lg shadow-purple-500/50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/60"
              >
                <span className="relative z-10">View Projects</span>
                <div className="absolute inset-0 -z-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>

              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 px-8 py-4 font-semibold text-purple-200 backdrop-blur-sm transition-all hover:border-purple-500/60 hover:bg-purple-500/20 hover:text-white"
              >
                Get in Touch
              </a>
            </div>

            {/* Tech stack pills */}
            <div
              className="motion-fade-up flex flex-wrap gap-3"
              style={{ "--motion-delay": "500ms" }}
            >
              {["Docker", "Jenkins", "Kubernetes", "Terraform", "AWS"].map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-slate-700/50 bg-slate-900/50 px-4 py-2 text-sm font-medium text-slate-300 backdrop-blur-sm transition-colors hover:border-purple-500/50 hover:text-white"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Right side - 3D Card effect */}
          <div
            className="motion-fade-up relative hidden lg:block"
            style={{ "--motion-delay": "300ms" }}
          >
            <div className="motion-float relative">
              {/* Glow effect */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 blur-2xl" />
              
              {/* Main card */}
              <div className="glass-panel relative overflow-hidden rounded-2xl p-8">
                {/* Pipeline visualization */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-mono uppercase tracking-wider text-purple-300">
                        CI/CD Pipeline
                      </p>
                      <h3 className="mt-2 text-2xl font-bold text-white">
                        Automated Deploy
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                      </span>
                      <span className="text-sm font-medium text-emerald-300">Active</span>
                    </div>
                  </div>

                  {/* Pipeline steps */}
                  <div className="space-y-4">
                    {[
                      { name: "Build", status: "complete", time: "1m 23s" },
                      { name: "Test", status: "complete", time: "45s" },
                      { name: "Scan", status: "complete", time: "2m 10s" },
                      { name: "Deploy", status: "running", time: "..." },
                    ].map((step, index) => (
                      <div
                        key={step.name}
                        className="flex items-center gap-4 rounded-lg border border-slate-700/50 bg-slate-900/50 p-4"
                      >
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                            step.status === "running"
                              ? "animate-pulse bg-cyan-500/20 text-cyan-400"
                              : "bg-emerald-500/20 text-emerald-400"
                          }`}
                        >
                          {step.status === "complete" ? "✓" : index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-white">{step.name}</p>
                          <p className="text-sm text-slate-400">{step.time}</p>
                        </div>
                        {step.status === "running" && (
                          <div className="h-2 w-16 overflow-hidden rounded-full bg-slate-700">
                            <div className="motion-pipeline-line h-full w-full bg-cyan-500" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4 border-t border-slate-700/50 pt-6">
                    {[
                      { label: "Uptime", value: "99.9%" },
                      { label: "Deploys", value: "847" },
                      { label: "Tests", value: "59/59" },
                    ].map((metric) => (
                      <div key={metric.label} className="text-center">
                        <p className="text-xl font-bold text-white">{metric.value}</p>
                        <p className="text-xs text-slate-400">{metric.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
