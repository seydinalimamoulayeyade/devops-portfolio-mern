const skillCategories = [
  {
    title: "DevOps & CI/CD",
    icon: "⚙️",
    skills: [
      { name: "Docker", level: 90, color: "from-blue-500 to-cyan-500" },
      { name: "Jenkins", level: 85, color: "from-red-500 to-orange-500" },
      { name: "Kubernetes", level: 80, color: "from-blue-600 to-purple-600" },
      { name: "Terraform", level: 75, color: "from-purple-500 to-pink-500" },
    ],
  },
  {
    title: "Cloud & Infrastructure",
    icon: "☁️",
    skills: [
      { name: "AWS", level: 80, color: "from-orange-500 to-yellow-500" },
      { name: "Linux", level: 85, color: "from-gray-600 to-gray-800" },
      { name: "Monitoring", level: 70, color: "from-green-500 to-emerald-500" },
      { name: "Security", level: 75, color: "from-red-600 to-pink-600" },
    ],
  },
  {
    title: "Development",
    icon: "💻",
    skills: [
      { name: "React", level: 85, color: "from-cyan-400 to-blue-500" },
      { name: "Node.js", level: 80, color: "from-green-600 to-green-800" },
      { name: "MongoDB", level: 75, color: "from-green-500 to-emerald-600" },
      { name: "Laravel", level: 70, color: "from-red-500 to-red-700" },
    ],
  },
];

function SkillBar({ skill, index }) {
  return (
    <div
      className="motion-fade-up space-y-2"
      style={{ "--motion-delay": `${index * 80}ms` }}
    >
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-white">{skill.name}</span>
        <span className="text-slate-400">{skill.level}%</span>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${skill.color} transition-all duration-1000 ease-out`}
          style={{
            width: `${skill.level}%`,
            animation: "shimmer 3s infinite",
          }}
        />
      </div>
    </div>
  );
}

export default function SkillsSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
        {/* Section header */}
        <div className="mb-16 text-center">
          <div
            className="motion-fade-up mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2"
            style={{ "--motion-delay": "0ms" }}
          >
            <span className="text-2xl">🚀</span>
            <span className="text-sm font-semibold text-purple-300">
              Technical Skills
            </span>
          </div>
          <h2
            className="motion-fade-up mb-4 text-4xl font-bold text-white sm:text-5xl"
            style={{ "--motion-delay": "100ms" }}
          >
            Technology <span className="gradient-text">Stack</span>
          </h2>
          <p
            className="motion-fade-up mx-auto max-w-2xl text-lg text-slate-400"
            style={{ "--motion-delay": "200ms" }}
          >
            A comprehensive skill set covering the entire DevOps lifecycle,
            from development to deployment and monitoring.
          </p>
        </div>

        {/* Skills grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category, catIndex) => (
            <div
              key={category.title}
              className="motion-fade-up glass-panel group overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-105"
              style={{ "--motion-delay": `${catIndex * 150}ms` }}
            >
              {/* Category header */}
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 text-2xl">
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-white">
                  {category.title}
                </h3>
              </div>

              {/* Skills list */}
              <div className="space-y-4">
                {category.skills.map((skill, index) => (
                  <SkillBar key={skill.name} skill={skill} index={index} />
                ))}
              </div>

              {/* Hover glow effect */}
              <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-purple-500/0 via-pink-500/0 to-cyan-500/0 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-20" />
            </div>
          ))}
        </div>

        {/* Certifications/Stats section */}
        <div
          className="motion-fade-up mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          style={{ "--motion-delay": "500ms" }}
        >
          {[
            { value: "5+", label: "DevOps Modules", sublabel: "Completed" },
            { value: "59", label: "Tests Passed", sublabel: "80.3% Coverage" },
            { value: "100%", label: "Uptime", sublabel: "Production" },
            { value: "847", label: "Deployments", sublabel: "Automated" },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-xl border border-purple-500/20 bg-slate-900/40 p-6 text-center backdrop-blur-sm transition-all hover:border-purple-500/60 hover:bg-slate-900/60"
            >
              <div className="relative z-10">
                <div className="mb-2 text-4xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-slate-300">
                  {stat.label}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {stat.sublabel}
                </div>
              </div>
              
              {/* Animated border */}
              <div className="absolute inset-0 -z-10">
                <div className="absolute inset-[-2px] animate-[shimmer_3s_infinite] bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 opacity-0 blur transition-opacity group-hover:opacity-30" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
