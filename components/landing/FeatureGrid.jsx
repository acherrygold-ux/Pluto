import ProductCard from "./ProductCard";

const CARDS = [
  {
    icon: "🧭",
    tone: "indigo",
    title: "Decision Debt Agent",
    tagline: "Cut decision debt fast",
    description:
      "Describe a dilemma. Get 2–3 clear options with pros, cons, and one honest recommendation.",
    href: "/decide"
  },
  {
    icon: "🗺️",
    tone: "emerald",
    title: "Broken System Navigator",
    tagline: "Untangle the red tape",
    description:
      "Paste any messy bureaucratic problem. Get a step-by-step action plan, required documents, and insider tips.",
    href: "/navigate"
  },
  {
    icon: "📜",
    tone: "rose",
    title: "Contract Loophole Hunter",
    tagline: "Find the loopholes",
    description:
      "Paste any contract. We surface the risky clauses, explain them in plain English, and tell you what they mean.",
    href: "/analyze"
  }
];

export default function FeatureGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Three agents. One clean dashboard.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
          Each module is built to deliver clear value in under 30 seconds.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {CARDS.map((c) => (
          <ProductCard key={c.href} {...c} />
        ))}
      </div>
    </section>
  );
}