import { randomUUID } from "node:crypto";
import { runAnalyze } from "@/lib/llm";
import { saveInsight } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const contract = typeof req.body?.contract === "string" ? req.body.contract.trim() : "";

    if (!contract) {
      return res.status(400).json({ error: "Field 'contract' is required." });
    }
    if (contract.length < 40) {
      return res.status(400).json({ error: "Contract text is too short to analyse." });
    }
    if (contract.length > 16000) {
      return res.status(400).json({ error: "Contract too long (max 16000 chars)." });
    }

    const result = await runAnalyze(contract);
    const id = randomUUID();

    saveInsight({
      id,
      type: "analyze",
      label: result.label,
      input: { contract },
      output: result
    });

    return res.status(200).json({
      id,
      type: "analyze",
      createdAt: Date.now(),
      label: result.label,
      summary: result.summary,
      riskCounts: result.riskCounts,
      clauses: result.clauses
    });
  } catch (err) {
    console.error("[api/analyze]", err.message);
    return res.status(500).json({ error: err.message || "Failed to analyse contract." });
  }
}