import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { fetchHistory, onInsightsRefresh } from "@/lib/insights";

const META = {
  decide: { icon: "🧭", title: "Last Decision", href: "/decide" },
  navigate: { icon: "🗺️", title: "Last Navigation", href: "/navigate" },
  analyze: { icon: "📜", title: "Last Contract Risk", href: "/analyze" }
};

function relTime(ts) {
  if (!ts) return "";
  const d = Date.now() - ts;
  if (d < 60000) return "just now";
  if (d < 3600000) return `${Math.floor(d / 60000)}m ago`;
  if (d < 86400000) return `${Math.floor(d / 3600000)}h ago`;
  return `${Math.floor(d / 86400000)}d ago`;
}

export default function Sidebar() {
  const [latest, setLatest] = useState({ decide: null, navigate: null, analyze: null });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await fetchHistory({ limit: 20 });
      const items = Array.isArray(data?.items) ? data.items : [];
      const next = { decide: null, navigate: null, analyze: null };
      for (const it of items) if (next[it.type] == null) next[it.type] = it;
      setLatest(next);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => {
    load();
    return onInsightsRefresh(load);
  }, [load]);

  const hasAny = latest.decide || latest.navigate || latest.analyze;

  return (
    <aside className="hidden w-[280px] shrink-0 border-l border-slate-200 bg-white/50 lg:block">
      <div className="sticky top-16 p-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Recent Insights</h2>
        <div className="mt-4 space-y-3">
          {loading ? (
            <>
              <div className="skeleton h-14 w-full" />
              <div className="skeleton h-14 w-full" />
              <div className="skeleton h-14 w-full" />
            </>
          ) : !hasAny ? (
            <p className="text-sm text-slate-500">Your insights will appear here.</p>
          ) : (
            ["decide", "navigate", "analyze"].map(type => {
              const item = latest[type];
              const meta = META[type];
              if (!item) return (
                <div key={type} className="rounded-lg border border-dashed border-slate-200 p-3 text-xs text-slate-400">
                  <span className="mr-2">{meta.icon}</span>{meta.title} — none yet
                </div>
              );
              return (
                <Link key={item.id} href={`${meta.href}?id=${encodeURIComponent(item.id)}`} className="block rounded-lg border border-slate-200 bg-white p-3 hover:border-indigo-300">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <span>{meta.icon}</span>{meta.title}
                  </div>
                  <div className="mt-1 line-clamp-1 text-sm font-semibold text-slate-900">{item.label || "Untitled"}</div>
                  <div className="mt-1 text-xs text-slate-500">{relTime(item.createdAt)}</div>
                </Link>
              );
            })
          )}
        </div>
        <div className="mt-5">
          <Link href="/history" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">View all history →</Link>
        </div>
      </div>
    </aside>
  );
}