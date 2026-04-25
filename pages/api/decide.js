import { randomUUID } from "node:crypto";
import { runDecide } from "@/lib/llm";
import { saveInsight } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const dilemma = typeof req.body?.dilemma === "string" ? req.body.dilemma.trim() : "";
    if (!dilemma) return res.status(400).json({ error: "Field 'dilemma' is required." });
    if (dilemma.length > 4000) return res.status(400).json({ error: "Dilemma too long." });
    const result = await runDecide(dilemma);
    const id = randomUUID();
    saveInsight({ id, type: "decide", label: result.label, input: { dilemma }, output: result });
    return res.status(200).json({ id, type: "decide", createdAt: Date.now(), label: result.label, options: result.options, recommendation: result.recommendation });
  } catch (err) {
    console.error("[api/decide]", err.message);
    return res.status(500).json({ error: err.message || "Failed." });
  }
}