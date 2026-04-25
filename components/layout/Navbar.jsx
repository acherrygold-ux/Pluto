import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const LINKS = [
  { href: "/decide", label: "Decide" },
  { href: "/navigate", label: "Navigate" },
  { href: "/analyze", label: "Analyze" },
  { href: "/history", label: "History" }
];

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handle = () => setOpen(false);
    router.events.on("routeChangeComplete", handle);
    return () => router.events.off("routeChangeComplete", handle);
  }, [router.events]);

  const isActive = href => href === "/" ? router.pathname === "/" : router.pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">🧠</span>
          <span className="text-base font-semibold">LifeOps</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} className={`rounded-lg px-3 py-2 text-sm font-medium ${isActive(l.href) ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100"}`}>
              {l.label}
            </Link>
          ))}
        </nav>
        <button onClick={() => setOpen(v => !v)} className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden" aria-label="Toggle menu">
          {open ? "✕" : "☰"}
        </button>
      </div>
      {open && (
        <nav className="border-t border-slate-200 bg-white md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-2 sm:px-6">
            {LINKS.map(l => (
              <Link key={l.href} href={l.href} className={`rounded-lg px-3 py-2 text-sm font-medium ${isActive(l.href) ? "bg-indigo-50 text-indigo-700" : "text-slate-700 hover:bg-slate-100"}`}>
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}