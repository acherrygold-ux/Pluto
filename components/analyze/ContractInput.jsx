import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

const MAX = 16000;
const MIN = 40;

export default function ContractInput({ onSubmit, loading, initialValue = "" }) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (initialValue) setValue(initialValue);
  }, [initialValue]);

  const tooShort = value.trim().length > 0 && value.trim().length < MIN;

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || trimmed.length < MIN || loading) return;
    onSubmit(trimmed);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
      <label
        htmlFor="contract"
        className="block text-sm font-semibold text-slate-800"
      >
        Paste any contract
      </label>
      <p className="mt-1 text-xs text-slate-500">
        Terms of service, employment contract, NDA, lease — anything with legal language.
      </p>
      <textarea
        id="contract"
        rows={12}
        maxLength={MAX}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Paste the full text of the contract here…"
        className="mt-3 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-slate-900 placeholder:text-slate-400 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-200"
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <span
          className={`text-xs ${
            tooShort ? "text-rose-600" : "text-slate-500"
          }`}
        >
          {tooShort
            ? `Needs at least ${MIN} characters to analyse`
            : `${value.length} / ${MAX}`}
        </span>
        <Button
          onClick={handleSubmit}
          disabled={loading || !value.trim() || tooShort}
        >
          {loading ? "Scanning…" : "Scan Contract →"}
        </Button>
      </div>
    </div>
  );
}