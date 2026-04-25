import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { emitInsightsRefresh } from "@/lib/insights";

async function safeFetch(url, options = {}) {
  const res = await fetch(url, options);
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) throw new Error(`Server error ${res.status}. Check terminal.`);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data;
}

export default function NavigatePage() {
  const router = useRouter();
  const [problem, setProblem] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const { id } = router.query;
    if (!id || typeof id !== "string") return;
    (async () => {
      try {
        const data = await safeFetch(`/api/history?id=${encodeURIComponent(id)}`);
        if (data?.item?.type === "navigate") {
          setResult({
            label: data.item.label,
            steps: data.item.output?.steps || [],
            documents: data.item.output?.documents || [],
            tips: data.item.output?.tips || []
          });
          setProblem(data.item.input?.problem || "");
        }
      } catch (err) { setError(err.message); }
    })();
  }, [router.query]);

  const handleSubmit = async () => {
    const text = problem.trim();
    if (!text || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await safeFetch("/api/navigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem: text })
      });
      setResult({ label: data.label, steps: data.steps, documents: data.documents, tips: data.tips });
      emitInsightsRefresh();
      if (router.query.id) router.replace("/navigate", undefined, { shallow: true });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <>
      <Head><title>Navigate · LifeOps</title></Head>
      <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-start gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100 text-2xl text-emerald-700">🗺️</span>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Broken System Navigator</h1>
            <p className="mt-1 text-sm text-slate-600 sm:text-base">Paste the mess. Get the map — step by step.</p>
          </div>
        </header>

        <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <label className="block text-sm font-semibold text-slate-800">What's the broken process?</label>
          <p className="mt-1 text-xs text-slate-500">Example: "My passport renewal has been stuck for 6 weeks."</p>
          <textarea
            rows={5}
            maxLength={4000}
            value={problem}
            onChange={e => setProblem(e.target.value)}
            placeholder="Describe the mess you're stuck in…"
            className="mt-3 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-slate-500">{problem.length} / 4000</span>
            <button
              onClick={handleSubmit}
              disabled={loading || !problem.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Mapping…" : "Get Action Plan →"}
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
            <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Action plan</h2>
              <ol className="mt-4 space-y-5">
                {result.steps?.map((s, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">{s.n ?? i + 1}</span>
                      {i < result.steps.length - 1 && <span className="mt-1 w-px flex-1 bg-slate-200" />}
                    </div>
                    <div className="pb-1">
                      <h3 className="text-sm font-semibold text-slate-900">{s.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {result.documents?.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">📎 Documents you'll need</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {result.documents.map((d, i) => <li key={i} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">{d}</li>)}
                </ul>
              </div>
            )}

            {result.tips?.length > 0 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-800">💡 Smart tips</h2>
                <ul className="mt-3 space-y-2 text-sm text-amber-900">
                  {result.tips.map((t, i) => <li key={i} className="flex gap-2"><span>•</span><span>{t}</span></li>)}
                </ul>
              </div>
            )}
          </div>
        )}

        {!result && !loading && !error && (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            Your action plan will appear here once you describe the problem.
          </div>
        )}
      </section>
    </>
  );
}