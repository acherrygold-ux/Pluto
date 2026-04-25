export default function RecommendationBanner({ recommendation }) {
  if (!recommendation) return null;
  return (
    <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-700">
        <span aria-hidden="true">🎯</span>
        Recommended
      </div>
      <h2 className="mt-1 text-xl font-bold text-slate-900">
        {recommendation.choice}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">
        {recommendation.reasoning}
      </p>
    </div>
  );
}