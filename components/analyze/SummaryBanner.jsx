export default function SummaryBanner({ summary, clauses }) {
  if (!summary) return null;

  const counts = { high: 0, medium: 0, low: 0 };
  (clauses || []).forEach((c) => {
    if (counts[c.risk] != null) counts[c.risk] += 1;
  });

  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-700">
        <span aria-hidden="true">⚠️</span>
        Summary
      </div>
      <p className="mt-1 text-sm leading-relaxed text-slate-800">{summary}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-rose-600 px-2.5 py-1 font-semibold text-white">
          {counts.high} high
        </span>
        <span className="rounded-full bg-amber-500 px-2.5 py-1 font-semibold text-white">
          {counts.medium} medium
        </span>
        <span className="rounded-full bg-emerald-600 px-2.5 py-1 font-semibold text-white">
          {counts.low} low
        </span>
      </div>
    </div>
  );
}