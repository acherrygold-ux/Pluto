import Link from "next/link";
import IconBadge from "@/components/ui/IconBadge";

export default function ProductCard({
  icon,
  tone,
  title,
  tagline,
  description,
  href,
  cta = "Try it →"
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
    >
      <IconBadge emoji={icon} tone={tone} size="lg" />
      <h3 className="mt-5 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm font-medium text-indigo-600">{tagline}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
        {description}
      </p>
      <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-slate-900 group-hover:text-indigo-700">
        {cta}
      </span>
    </Link>
  );
}