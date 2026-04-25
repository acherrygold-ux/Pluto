const TONES = {
  high:   { border: "border-rose-300",    bg: "bg-rose-50",    chip: "bg-rose-600 text-white",    dot: "🔴", label: "High risk"   },
  medium: { border: "border-amber-300",   bg: "bg-amber-50",   chip: "bg-amber-500 text-white",   dot: "🟠", label: "Medium risk" },
  low:    { border: "border-emerald-300", bg: "bg-emerald-50", chip: "bg-emerald-600 text-white", dot: "🟢", label: "Low risk"    }
};

export default function RiskClauseCard({ clause }) {
  const tone = TONES[clause.risk] || TONES.medium;
  return (
    <div
      className={`rounded-xl border ${tone.border} ${tone.bg} p-5 sm:p-6`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <span aria-hidden="true">{tone.dot}</span>
          {tone.label}
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${tone.chip}`}
        >
          {clause.risk}
        </span>
      </div>
      {clause.quote ? (
        <blockquote className="mt-3 border-l-4 border-slate-300 bg-white/60 px-3 py-2 text-xs italic text-slate-700">
          "{clause.quote}"
        </blockquote>
      ) : null}
      {clause.explanation ? (
        <p className="mt-3 text-sm leading-relaxed text-slate-800">
          <span className="font-semibold">Plain English:</span> {clause.explanation}
        </p>
      ) : null}
      {clause.impact ? (
        <p className="mt-2 text-sm leading-relaxed text-slate-800">
          <span className="font-semibold">What this means for you:</span>{" "}
          {clause.impact}
        </p>
      ) : null}
    </div>
  );
}