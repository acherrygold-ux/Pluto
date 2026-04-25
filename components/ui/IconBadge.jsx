export default function IconBadge({ emoji, tone = "indigo", size = "md" }) {
  const tones = {
    indigo: "bg-indigo-100 text-indigo-700",
    emerald: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-800",
    rose: "bg-rose-100 text-rose-700",
    slate: "bg-slate-100 text-slate-700"
  };

  const sizes = {
    sm: "h-8 w-8 text-base",
    md: "h-10 w-10 text-lg",
    lg: "h-14 w-14 text-2xl"
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-xl ${
        tones[tone] || tones.indigo
      } ${sizes[size] || sizes.md}`}
      aria-hidden="true"
    >
      {emoji}
    </span>
  );
}