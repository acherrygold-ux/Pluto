import { getInsightById, listInsights } from "@/lib/db";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id, limit, type } = req.query;

    if (typeof id === "string" && id.length > 0) {
      const item = getInsightById(id);
      if (!item) {
        return res.status(404).json({ error: "Insight not found." });
      }
      return res.status(200).json({ item });
    }

    const safeLimit = Math.max(1, Math.min(100, Number(limit) || 10));
    const safeType = ["decide", "navigate", "analyze"].includes(type) ? type : null;
    const items = listInsights({ limit: safeLimit, type: safeType });

    return res.status(200).json({ items });
  } catch (err) {
    console.error("[api/history]", err.message);
    return res.status(500).json({ error: "Failed to load history." });
  }
}