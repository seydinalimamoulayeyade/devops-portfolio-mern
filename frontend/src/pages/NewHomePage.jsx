import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import SkillsSection from "../components/SkillsSection";
import ModernProjectCard from "../components/ModernProjectCard";
import RevealSection from "../components/RevealSection";
import { getAllProjects } from "../services/projetService";

export default function NewHomePage() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    async function loadFeaturedProjects() {
      try {
        const data = await getAllProjects();
        setFeaturedProjects(data.slice(0, 6)); // Show 6 projects
      } catch (error) {
        console.error("Failed to load featured projects:", error);
        setFeaturedProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    }

    loadFeaturedProjects();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* About Section */}
      <RevealSection>
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              {/* Left side - Text */}
              <div className="space-y-6">
                <div
                  className="motion-fade-up inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2"
                  style={{ "--motion-delay": "0ms" }}
                >
                  <span className="text-sm font-semibold text-cyan-300">About Me</span>
                </div>
                
                <h2
                  className="motion-fade-up text-4xl font-bold text-white sm:text-5xl"
                  style={{ "--motion-delay": "100ms" }}
                >
                  DevOps Engineer with a passion for{" "}
                  <span className="gradient-text">automation</span>
                </h2>
                
                <div
                  className="motion-fade-up space-y-4 text-lg leading-relaxed text-slate-300"
                  style={{ "--motion-delay": "200ms" }}
                >
                  <p>
                    I'm a DevOps engineer specializing in cloud infrastructure,
                    containerization, and CI/CD automation. Currently mastering
                    AWS services and Kubernetes orchestration.
                  </p>
                  <p>
                    My approach combines solid development skills (MERN stack, Laravel)
                    with modern DevOps practices to build scalable, reliable systems.
                  </p>
                </div>

                <div
                  className="motion-fade-up flex flex-wrap gap-4"
                  style={{ "--motion-delay": "300ms" }}
                >
                  <a
                    href="mailto:seydinalimamoulayeyade@gmail.com"
                    className="inline-flex items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-6 py-3 font-semibold text-purple-300 transition-all hover:border-purple-500/60 hover:bg-purple-500/20"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact Me
                  </a>
                  
                  <a
                    href="https://github.com/seydinalimamoulayeyade"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-300 transition-all hover:border-slate-600 hover:text-white"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    GitHub
                  </a>
                </div>
              </div>

              {/* Right side - Stats cards */}
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    icon: "🎯",
                    title: "Mission",
                    description: "Build reliable, automated deployment pipelines",
                  },
                  {
                    icon: "🚀",
                    title: "Focus",
                    description: "Docker, Kubernetes, Terraform, AWS",
                  },
                  {
                    icon: "📚",
                    title: "Learning",
                    description: "Cloud architecture and microservices",
                  },
                  {
                    icon: "💡",
                    title: "Goal",
                    description: "Master DevOps best practices",
                  },
                ].map((item, index) => (
                  <div
                    key={item.title}
                    className="motion-fade-up glass-panel group rounded-2xl p-6 transition-all hover:scale-105"
                    style={{ "--motion-delay": `${index * 100}ms` }}
                  >
                    <div className="mb-3 text-4xl">{item.icon}</div>
                    <h3 className="mb-2 text-lg font-bold text-white">{item.title}</h3>
                    <p className="text-sm text-slate-400">{item.description}</p>
                    
                    {/* Hover glow */}
                    <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-purple-500/0 via-pink-500/0 to-cyan-500/0 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-20" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* Skills Section */}
      <SkillsSection />

      {/* DevOps Pipeline Section */}
      <RevealSection>
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
            <div className="text-center">
              <div
                className="motion-fade-up mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2"
                style={{ "--motion-delay": "0ms" }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-sm font-semibold text-emerald-300">Live Pipeline</span>
              </div>
              
              <h2
                className="motion-fade-up mb-4 text-4xl font-bold text-white sm:text-5xl"
                style={{ "--motion-delay": "100ms" }}
              >
                Automated <span className="gradient-text">CI/CD Pipeline</span>
              </h2>
              
              <p
                className="motion-fade-up mx-auto mb-12 max-w-2xl text-lg text-slate-400"
                style={{ "--motion-delay": "200ms" }}
              >
                7-stage Jenkins pipeline with Docker, testing, quality gates,
                Terraform validation, and Kubernetes deployment.
              </p>
            </div>

            <div
              className="motion-fade-up glass-panel mx-auto max-w-4xl rounded-2xl p-8"
              style={{ "--motion-delay": "300ms" }}
            >
              <div className="space-y-4">
                {[
                  { name: "Checkout", icon: "📥", status: "complete", time: "10s" },
                  { name: "Backend Tests", icon: "🧪", status: "complete", time: "45s" },
                  { name: "SonarQube Analysis", icon: "🔍", status: "complete", time: "30s" },
                  { name: "Quality Gate", icon: "✅", status: "complete", time: "30s" },
                  { name: "Build & Push", icon: "🐳", status: "complete", time: "2m 30s" },
                  { name: "Terraform Validate", icon: "🏗️", status: "complete", time: "20s" },
                  { name: "Deploy K8s", icon: "☸️", status: "complete", time: "1m 15s" },
                ].map((stage, index) => (
                  <div
                    key={stage.name}
                    className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4 transition-colors hover:border-purple-500/30"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 text-2xl">
                      {stage.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{stage.name}</h4>
                      <p className="text-sm text-slate-400">{stage.time}</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-300">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Passed
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-6 grid grid-cols-3 gap-4 border-t border-slate-800 pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">100%</div>
                  <div className="text-sm text-slate-400">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">5m 30s</div>
                  <div className="text-sm text-slate-400">Total Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">847</div>
                  <div className="text-sm text-slate-400">Deployments</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* Projects Section */}
      <RevealSection>
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
            <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div
                  className="motion-fade-up mb-4 inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-2"
                  style={{ "--motion-delay": "0ms" }}
                >
                  <span className="text-sm font-semibold text-pink-300">Portfolio</span>
                </div>
                <h2
                  className="motion-fade-up text-4xl font-bold text-white sm:text-5xl"
                  style={{ "--motion-delay": "100ms" }}
                >
                  Featured <span className="gradient-text">Projects</span>
                </h2>
                <p
                  className="motion-fade-up mt-4 max-w-2xl text-lg text-slate-400"
                  style={{ "--motion-delay": "200ms" }}
                >
                  A showcase of my recent work in DevOps, cloud infrastructure,
                  and full-stack development.
                </p>
              </div>

              <Link
                to="/projets"
                className="motion-fade-up inline-flex items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-6 py-3 font-semibold text-purple-300 transition-all hover:border-purple-500/60 hover:bg-purple-500/20"
                style={{ "--motion-delay": "300ms" }}
              >
                View All Projects
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {loadingProjects ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-96 animate-pulse rounded-2xl border border-purple-500/20 bg-slate-900/40"
                  />
                ))}
              </div>
            ) : featuredProjects.length === 0 ? (
              <div className="glass-panel rounded-2xl p-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10">
                  <svg className="h-8 w-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">No projects yet</h3>
                <p className="text-slate-400">Check back soon for new projects</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featuredProjects.map((project, index) => (
                  <ModernProjectCard
                    key={project._id || project.id}
                    project={project}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </RevealSection>

      {/* CTA Section */}
      <RevealSection>
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
            <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-cyan-500/10 p-12 backdrop-blur-sm">
              {/* Glow effects */}
              <div className="absolute -left-1/4 top-0 h-96 w-96 rounded-full bg-purple-500/30 blur-3xl" />
              <div className="absolute -right-1/4 bottom-0 h-96 w-96 rounded-full bg-cyan-500/30 blur-3xl" />
              
              <div className="relative z-10 text-center">
                <h2 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
                  Let's Build Something <span className="gradient-text">Amazing</span>
                </h2>
                <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-300">
                  Need a DevOps engineer for your next project? I'm available for
                  freelance work and full-time opportunities.
                </p>
                
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <a
                    href="mailto:seydinalimamoulayeyade@gmail.com"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 font-semibold text-white shadow-lg shadow-purple-500/50 transition-transform hover:scale-105"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Get in Touch
                  </a>
                  
                  <Link
                    to="/projets"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                  >
                    View Portfolio
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>
    </div>
  );
}
