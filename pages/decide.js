import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { emitInsightsRefresh } from "@/lib/insights";

async function safeFetch(url, options = {}) {
  const res = await fetch(url, options);
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    throw new Error(`Server error ${res.status}. Check terminal.`);
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data;
}

export default function DecidePage() {
  const router = useRouter();
  const [dilemma, setDilemma] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const { id } = router.query;
    if (!id || typeof id !== "string") return;
    (async () => {
      try {
        const data = await safeFetch(`/api/history?id=${encodeURIComponent(id)}`);
        if (data?.item?.type === "decide") {
          setResult({
            label: data.item.label,
            options: data.item.output?.options || [],
            recommendation: data.item.output?.recommendation || null
          });
          setDilemma(data.item.input?.dilemma || "");
        }
      } catch (err) { setError(err.message); }
    })();
  }, [router.query]);

  const handleSubmit = async () => {
    const text = dilemma.trim();
    if (!text || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await safeFetch("/api/decide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dilemma: text })
      });
      setResult({ label: data.label, options: data.options, recommendation: data.recommendation });
      emitInsightsRefresh();
      if (router.query.id) router.replace("/decide", undefined, { shallow: true });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <>
      <Head><title>Decide · LifeOps</title></Head>
      <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-start gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-100 text-2xl text-indigo-700">🧭</span>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Decision Debt Agent</h1>
            <p className="mt-1 text-sm text-slate-600 sm:text-base">Describe your dilemma. Get a clear call in seconds.</p>
          </div>
        </header>

        <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <label className="block text-sm font-semibold text-slate-800">What's the dilemma?</label>
          <p className="mt-1 text-xs text-slate-500">Example: "Should I accept the job offer in Berlin or stay in my current role?"</p>
          <textarea
            rows={4}
            maxLength={4000}
            value={dilemma}
            onChange={e => setDilemma(e.target.value)}
            placeholder="Type your dilemma here…"
            className="mt-3 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-slate-500">{dilemma.length} / 4000</span>
            <button
              onClick={handleSubmit}
              disabled={loading || !dilemma.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Analysing…" : "Analyse Decision →"}
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
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 space-y-3">
            <div className="skeleton h-5 w-1/3" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-5/6" />
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-6">
            {result.recommendation && (
              <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-indigo-700">🎯 Recommended</div>
                <h2 className="mt-1 text-xl font-bold text-slate-900">{result.recommendation.choice}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{result.recommendation.reasoning}</p>
              </div>
            )}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {result.options?.map((opt, i) => {
                const isPick = result.recommendation && opt.title === result.recommendation.choice;
                return (
                  <div key={i} className={`flex flex-col rounded-xl border bg-white p-5 ${isPick ? "border-indigo-400 ring-2 ring-indigo-100" : "border-slate-200"}`}>
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold text-slate-900">{opt.title}</h3>
                      {isPick && <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-semibold uppercase text-white">Pick</span>}
                    </div>
                    <div className="mt-4">
                      <h4 className="text-xs font-semibold uppercase text-emerald-700">Pros</h4>
                      <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
                        {opt.pros?.map((p, j) => <li key={j} className="flex gap-2"><span className="text-emerald-600">✓</span><span>{p}</span></li>)}
                      </ul>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-xs font-semibold uppercase text-rose-700">Cons</h4>
                      <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
                        {opt.cons?.map((c, j) => <li key={j} className="flex gap-2"><span className="text-rose-600">✕</span><span>{c}</span></li>)}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!result && !loading && !error && (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            Your recommendation will appear here once you submit a dilemma.
          </div>
        )}
      </section>
    </>
  );
}