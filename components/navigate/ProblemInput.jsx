import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

const MAX = 4000;

export default function ProblemInput({ onSubmit, loading, initialValue = "" }) {
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
        htmlFor="problem"
        className="block text-sm font-semibold text-slate-800"
      >
        What's the broken process?
      </label>
      <p className="mt-1 text-xs text-slate-500">
        Example: "My passport renewal has been stuck in processing for 6 weeks and nobody will give me a status."
      </p>
      <textarea
        id="problem"
        rows={5}
        maxLength={MAX}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Describe the mess you're stuck in…"
        className="mt-3 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
      />
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          {value.length} / {MAX}
        </span>
        <Button onClick={handleSubmit} disabled={loading || !value.trim()}>
          {loading ? "Mapping…" : "Get Action Plan →"}
        </Button>
      </div>
    </div>
  );
}