import Link from "next/link";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
          <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
          Autonomous Life Admin Agent
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          Your autonomous life admin agent.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600 sm:text-lg">
          LifeOps handles the decisions, paperwork, and fine print you've been
          avoiding — so your mental bandwidth is free for the work that matters.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/decide">
            <Button>Get started →</Button>
          </Link>
          <Link href="/analyze">
            <Button variant="secondary">See an example</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}