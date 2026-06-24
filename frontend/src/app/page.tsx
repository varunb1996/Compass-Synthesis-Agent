import Link from "next/link";

const DOMAINS = [
  { icon: "⚕", label: "Health", color: "#22c55e", desc: "Medical navigation & options" },
  { icon: "💰", label: "Finance", color: "#f59e0b", desc: "Cash flow & relief programs" },
  { icon: "⚖", label: "Legal", color: "#3b82f6", desc: "Rights & free legal resources" },
  { icon: "💼", label: "Career", color: "#8b5cf6", desc: "Employment & job transitions" },
  { icon: "🏠", label: "Home", color: "#ec4899", desc: "Housing & tenant rights" },
  { icon: "🏛", label: "Government", color: "#06b6d4", desc: "Benefits & public programs" },
  { icon: "👨‍👩‍👧", label: "Family", color: "#f97316", desc: "Communication & support" },
];

const STEPS = [
  {
    step: "01",
    title: "Describe your situation",
    desc: "Type anything — the messier, the more incomplete, the better. Compass doesn't need structured input.",
  },
  {
    step: "02",
    title: "7 agents work in parallel",
    desc: "Specialists in health, finance, legal, career, housing, government, and family analyze your situation simultaneously.",
  },
  {
    step: "03",
    title: "One prioritized action plan",
    desc: "Compass resolves conflicts between domains and delivers a single, ordered checklist — Immediate, This Week, This Month.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Nav */}
      <nav className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🧭</span>
          <span className="text-sm font-semibold tracking-tight text-zinc-100">Compass</span>
        </div>
        <Link
          href="/chat"
          className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-white"
        >
          Get started →
        </Link>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pt-24 pb-16 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs text-zinc-500">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          Free · No signup required · 7 AI agents
        </div>

        <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-zinc-100 sm:text-5xl">
          Your compound problems,
          <br />
          <span className="text-zinc-400">solved together.</span>
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-zinc-500">
          Life doesn&apos;t fit into one chat box. When you lose your job, it&apos;s also a
          health, finance, legal, and family problem. Compass sends seven specialist AI
          agents to work on your situation — simultaneously.
        </p>

        <Link
          href="/chat"
          className="inline-flex items-center gap-2 rounded-2xl bg-zinc-100 px-6 py-3.5 text-sm font-semibold text-zinc-900 transition-all hover:bg-white hover:shadow-lg hover:shadow-white/10"
        >
          Tell Compass what&apos;s going on
          <span>→</span>
        </Link>
      </section>

      {/* Domain grid */}
      <section className="mx-auto max-w-3xl px-6 pb-16">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
          {DOMAINS.map((d) => (
            <div
              key={d.label}
              className="flex flex-col items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 text-center"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
                style={{ backgroundColor: d.color + "20" }}
              >
                {d.icon}
              </div>
              <span className="text-xs font-medium text-zinc-300">{d.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-3xl px-6 pb-24">
        <h2 className="mb-8 text-center text-sm font-semibold uppercase tracking-widest text-zinc-600">
          How it works
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div
              key={s.step}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <div className="mb-3 text-2xl font-bold text-zinc-800">{s.step}</div>
              <h3 className="mb-2 text-sm font-semibold text-zinc-200">{s.title}</h3>
              <p className="text-xs leading-relaxed text-zinc-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] px-6 py-6 text-center text-xs text-zinc-700">
        Compass provides general guidance only, not professional medical, legal, or financial advice.
        Always verify with a licensed professional.
      </footer>
    </main>
  );
}
