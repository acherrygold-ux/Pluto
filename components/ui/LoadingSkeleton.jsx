export default function LoadingSkeleton({ variant = "lines" }) {
  if (variant === "card") {
    return (
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <div className="skeleton h-5 w-1/3" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-5/6" />
        <div className="skeleton h-4 w-2/3" />
      </div>
    );
  }

  if (variant === "grid") {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="space-y-3 rounded-xl border border-slate-200 bg-white p-5"
          >
            <div className="skeleton h-5 w-1/2" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-4/5" />
            <div className="skeleton h-4 w-3/5" />
          </div>
        ))}
      </div>
    );
  }

  // default: lines
  return (
    <div className="space-y-3">
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-11/12" />
      <div className="skeleton h-4 w-9/12" />
      <div className="skeleton h-4 w-10/12" />
    </div>
  );
}