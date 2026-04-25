export default function DocumentsList({ documents }) {
  if (!documents || documents.length === 0) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
        <span aria-hidden="true">📎</span>
        Documents you'll need
      </h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {documents.map((d, i) => (
          <li
            key={i}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
          >
            {d}
          </li>
        ))}
      </ul>
    </div>
  );
}