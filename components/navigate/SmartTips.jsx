export default function SmartTips({ tips }) {
  if (!tips || tips.length === 0) return null;
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-amber-800">
        <span aria-hidden="true">💡</span>
        Smart tips
      </h2>
      <ul className="mt-3 space-y-2 text-sm text-amber-900">
        {tips.map((t, i) => (
          <li key={i} className="flex gap-2">
            <span aria-hidden="true">•</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}