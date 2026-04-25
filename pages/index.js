import Head from "next/head";
import Link from "next/link";

const CARDS = [
  { icon: "🧭", title: "Decision Debt Agent", tagline: "Cut decision debt fast", desc: "Describe a dilemma. Get options with pros, cons, and one honest recommendation.", href: "/decide" },
  { icon: "🗺️", title: "Broken System Navigator", tagline: "Untangle the red tape", desc: "Paste any messy bureaucratic problem. Get a step-by-step action plan.", href: "/navigate" },
  { icon: "📜", title: "Contract Loophole Hunter", tagline: "Find the loopholes", desc: "Paste any contract. Surface risky clauses in plain English.", href: "/analyze" }
];

export default function LandingPage() {
  return (
    <>
      <Head><title>LifeOps — Autonomous Life Admin Agent</title></Head>
      <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:py-24 lg:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Autonomous Life Admin Agent
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Your autonomous life admin agent.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600 sm:text-lg">
            LifeOps handles the decisions, paperwork, and fine print you've been avoiding.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/decide" className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Get started →</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Three agents. One clean dashboard.</h2>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">Each module delivers clear value in under 30 seconds.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {CARDS.map(c => (
            <Link key={c.href} href={c.href} className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-100 text-2xl text-indigo-700">{c.icon}</span>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">{c.title}</h3>
              <p className="mt-1 text-sm font-medium text-indigo-600">{c.tagline}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{c.desc}</p>
              <span className="mt-6 text-sm font-semibold text-slate-900 group-hover:text-indigo-700">Try it →</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}