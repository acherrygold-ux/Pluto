export default function OptionCard({ option, isRecommended }) {
  return (
    <div
      className={`flex h-full flex-col rounded-xl border bg-white p-5 ${
        isRecommended ? "border-indigo-400 ring-2 ring-indigo-100" : "border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">
          {option.title}
        </h3>
        {isRecommended ? (
          <span className="inline-flex items-center rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
            Pick
          </span>
        ) : null}
      </div>

      <div className="mt-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
          Pros
        </h4>
        <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
          {option.pros?.map((p, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-emerald-600" aria-hidden="true">
                ✓
              </span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-700">
          Cons
        </h4>
        <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
          {option.cons?.map((c, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-rose-600" aria-hidden="true">
                ✕
              </span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}