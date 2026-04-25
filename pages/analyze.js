import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { emitInsightsRefresh } from "@/lib/insights";

const TONES = {
  high: { border: "border-rose-300", bg: "bg-rose-50", chip: "bg-rose-600", dot: "🔴", label: "High risk" },
  medium: { border: "border-amber-300", bg: "bg-amber-50", chip: "bg-amber-500", dot: "🟠", label: "Medium risk" },
  low: { border: "border-emerald-300", bg: "bg-emerald-50", chip: "bg-emerald-600", dot: "🟢", label: "Low risk" }
};

async function safeFetch(url, options = {}) {
  const res = await fetch(url, options);
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    throw new Error(`Server error ${res.status}. Check terminal for details.`);
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data;
}

export default function AnalyzePage() {
  const router = useRouter();
  const [contract, setContract] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const { id } = router.query;
    if (!id || typeof id !== "string") return;
    (async () => {
      try {
        const data = await safeFetch(`/api/history?id=${encodeURIComponent(id)}`);
        if (data?.item?.type === "analyze") {
          setResult({
            label: data.item.label,
            summary: data.item.output?.summary || "",
            riskCounts: data.item.output?.riskCounts || { high: 0, medium: 0, low: 0 },
            clauses: data.item.output?.clauses || []
          });
          setContract(data.item.input?.contract || "");
        }
      } catch (err) { setError(err.message); }
    })();
  }, [router.query]);

  const handleSubmit = async () => {
    const text = contract.trim();
    if (text.length < 40 || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await safeFetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contract: text })
      });
      setResult({ label: data.label, summary: data.summary, riskCounts: data.riskCounts, clauses: data.clauses });
      emitInsightsRefresh();
      if (router.query.id) router.replace("/analyze", undefined, { shallow: true });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const tooShort = contract.trim().length > 0 && contract.trim().length < 40;

  return (
    <>
      <Head><title>Analyze · LifeOps</title></Head>
      <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-start gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-rose-100 text-2xl text-rose-700">📜</span>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Contract Loophole Hunter</h1>
            <p className="mt-1 text-sm text-slate-600 sm:text-base">Paste any contract. We'll find what bites.</p>
          </div>
        </header>

        <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <label className="block text-sm font-semibold text-slate-800">Paste any contract</label>
          <p className="mt-1 text-xs text-slate-500">Terms of service, employment contract, NDA, lease.</p>
          <textarea
            rows={12}
            maxLength={16000}
            value={contract}
            onChange={e => setContract(e.target.value)}
            placeholder="Paste the full text of the contract here…"
            className="mt-3 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
          <div className="mt-3 flex items-center justify-between">
            <span className={`text-xs ${tooShort ? "text-rose-600" : "text-slate-500"}`}>
              {tooShort ? "Needs at least 40 characters" : `${contract.length} / 16000`}
            </span>
            <button
              onClick={handleSubmit}
              disabled={loading || !contract.trim() || tooShort}
              className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Scanning…" : "Scan Contract →"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            <span>⚠️</span>
            <div className="flex-1">{error}</div>
            <button onClick={() => setError(null)} className="text-rose-700">✕</button>
          </div>
        )}

        {loading && !result && (
          <div className="mt-6 space-y-4">
            {[0, 1, 2].map(i => (
              <div key={i} className="rounded-xl border border-slate-200 bg-white p-6 space-y-3">
                <div className="skeleton h-5 w-1/3" />
                <div className="skeleton h-4 w-full" />
              </div>
            ))}
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-rose-700">⚠️ Summary</div>
              <p className="mt-1 text-sm leading-relaxed text-slate-800">{result.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-rose-600 px-2.5 py-1 font-semibold text-white">{result.riskCounts?.high || 0} high</span>
                <span className="rounded-full bg-amber-500 px-2.5 py-1 font-semibold text-white">{result.riskCounts?.medium || 0} medium</span>
                <span className="rounded-full bg-emerald-600 px-2.5 py-1 font-semibold text-white">{result.riskCounts?.low || 0} low</span>
              </div>
            </div>

            {result.clauses?.length === 0 && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800">
                ✅ No risky clauses detected.
              </div>
            )}

            {result.clauses?.map((c, i) => {
              const tone = TONES[c.risk] || TONES.medium;
              return (
                <div key={i} className={`rounded-xl border ${tone.border} ${tone.bg} p-5 sm:p-6`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{tone.dot} {tone.label}</div>
                      {c.title && <h3 className="mt-1 text-base font-semibold text-slate-900 sm:text-lg">{c.title}</h3>}
                    </div>
                    <span className={`shrink-0 rounded-full ${tone.chip} px-2 py-0.5 text-[10px] font-semibold uppercase text-white`}>{c.risk}</span>
                  </div>
                  {c.quote && <blockquote className="mt-4 border-l-4 border-slate-300 bg-white/60 px-3 py-2 text-xs italic text-slate-700">"{c.quote}"</blockquote>}
                  {c.explanation && <p className="mt-3 text-sm text-slate-800"><span className="font-semibold">Plain English:</span> {c.explanation}</p>}
                  {c.impact && <p className="mt-2 text-sm text-slate-800"><span className="font-semibold">What this means for you:</span> {c.impact}</p>}
                  {c.whyRisky && <p className="mt-2 text-sm text-slate-800"><span className="font-semibold">Why this is risky:</span> {c.whyRisky}</p>}
                </div>
              );
            })}
          </div>
        )}

        {!result && !loading && !error && (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            Risk findings will appear here once you scan a contract.
          </div>
        )}
      </section>
    </>
  );
}