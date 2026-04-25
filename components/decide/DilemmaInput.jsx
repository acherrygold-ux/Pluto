import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

const MAX = 4000;

export default function DilemmaInput({ onSubmit, loading, initialValue = "" }) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (initialValue) setValue(initialValue);
  }, [initialValue]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || loading) return;
    onSubmit(trimmed);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
      <label
        htmlFor="dilemma"
        className="block text-sm font-semibold text-slate-800"
      >
        What's the dilemma?
      </label>
      <p className="mt-1 text-xs text-slate-500">
        One or two sentences is enough. Example: "Should I accept the job offer in Berlin or stay in my current role?"
      </p>
      <textarea
        id="dilemma"
        rows={4}
        maxLength={MAX}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type your dilemma here…"
        className="mt-3 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
      />
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          {value.length} / {MAX}
        </span>
        <Button onClick={handleSubmit} disabled={loading || !value.trim()}>
          {loading ? "Analysing…" : "Analyse Decision →"}
        </Button>
      </div>
    </div>
  );
}