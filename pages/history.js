import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchHistory, onInsightsRefresh } from "@/lib/insights";

const META = {
  decide: { icon: "🧭", href: "/decide", noun: "Decision", tone: "bg-indigo-100 text-indigo-700" },
  navigate: { icon: "🗺️", href: "/navigate", noun: "Navigation", tone: "bg-emerald-100 text-emerald-700" },
  analyze: { icon: "📜", href: "/analyze", noun: "Contract", tone: "bg-rose-100 text-rose-700" }
};

function relTime(ts) {
  if (!ts) return "";
  const d = Date.now() - ts;
  if (d < 60000) return "just now";
  if (d < 3600000) return `${Math.floor(d / 60000)}m ago`;
  if (d < 86400000) return `${Math.floor(d / 3600000)}h ago`;
  return `${Math.floor(d / 86400000)}d ago`;
}

export default function HistoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchHistory({ limit: 50 });
      setItems(Array.isArray(data?.items) ? data.items : []);
      setError(null);
    } catch { setError("Couldn't load history."); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => onInsightsRefresh(load), []);

  return (
    <>
      <Head><title>History · LifeOps</title></Head>
      <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-start gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-2xl text-slate-700">🕘</span>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Your LifeOps History</h1>
            <p className="mt-1 text-sm text-slate-600 sm:text-base">Every decision, plan, and contract scan in one timeline.</p>
          </div>
        </header>

        {error && <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</div>}

        {loading ? (
          <div className="space-y-3">
            <div className="skeleton h-16 w-full" />
            <div className="skeleton h-16 w-full" />
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-sm font-medium text-slate-700">Nothing here yet.</p>
            <p className="mt-1 text-sm text-slate-500">Run any tool and it will show up here.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Link href="/decide" className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white">Try Decide</Link>
              <Link href="/navigate" className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white">Try Navigate</Link>
              <Link href="/analyze" className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white">Try Analyze</Link>
            </div>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map(it => {
              const m = META[it.type];
              if (!m) return null;
              return (
                <li key={it.id}>
                  <Link href={`${m.href}?id=${encodeURIComponent(it.id)}`} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 hover:border-indigo-300 hover:bg-indigo-50/40">
                    <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-lg ${m.tone}`}>{m.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium uppercase tracking-wider text-slate-500">{m.noun}</div>
                      <div className="mt-0.5 truncate text-sm font-semibold text-slate-900">{it.label || "Untitled"}</div>
                    </div>
                    <div className="shrink-0 text-xs text-slate-500">{relTime(it.createdAt)}</div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}