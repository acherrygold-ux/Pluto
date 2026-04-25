import IconBadge from "@/components/ui/IconBadge";

export default function PageShell({
  icon,
  tone = "indigo",
  title,
  subtitle,
  children
}) {
  return (
    <section className="page-enter mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex items-start gap-4">
        <IconBadge emoji={icon} tone={tone} size="lg" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-1 text-sm text-slate-600 sm:text-base">{subtitle}</p>
          ) : null}
        </div>
      </header>
      <div className="space-y-6">{children}</div>
    </section>
  );
}