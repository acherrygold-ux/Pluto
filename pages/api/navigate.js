import { randomUUID } from "node:crypto";
import { runNavigate } from "@/lib/llm";
import { saveInsight } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const problem = typeof req.body?.problem === "string" ? req.body.problem.trim() : "";
    if (!problem) return res.status(400).json({ error: "Field 'problem' is required." });
    if (problem.length > 4000) return res.status(400).json({ error: "Problem too long." });
    const result = await runNavigate(problem);
    const id = randomUUID();
    saveInsight({ id, type: "navigate", label: result.label, input: { problem }, output: result });
    return res.status(200).json({ id, type: "navigate", createdAt: Date.now(), label: result.label, steps: result.steps, documents: result.documents, tips: result.tips });
  } catch (err) {
    console.error("[api/navigate]", err.message);
    return res.status(500).json({ error: err.message || "Failed." });
  }
}