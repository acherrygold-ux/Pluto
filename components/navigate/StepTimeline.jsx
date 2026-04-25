export default function StepTimeline({ steps }) {
  if (!steps || steps.length === 0) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
        Action plan
      </h2>
      <ol className="mt-4 space-y-5">
        {steps.map((s, idx) => (
          <li key={idx} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
                {s.n ?? idx + 1}
              </span>
              {idx < steps.length - 1 ? (
                <span
                  className="mt-1 w-px flex-1 bg-slate-200"
                  aria-hidden="true"
                />
              ) : null}
            </div>
            <div className="pb-1">
              <h3 className="text-sm font-semibold text-slate-900">
                {s.title}
              </h3>
              {s.detail ? (
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  {s.detail}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}