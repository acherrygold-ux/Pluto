import { buildDecidePrompt, buildNavigatePrompt, buildAnalyzePrompt } from "./prompts.js";

const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

console.log("[BOOT] llm.js loaded. GROQ_API_KEY present:", !!process.env.GROQ_API_KEY);

async function callGroq({ system, user }) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY missing in .env.local — add it and restart the server");
  }

  console.log("[CALL] Groq model:", MODEL);

  const mod = await import("groq-sdk");
  const Groq = mod.default || mod.Groq;

  if (typeof Groq !== "function") {
    throw new Error("groq-sdk not installed — run: npm install groq-sdk");
  }

  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const completion = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: user }
    ]
  });

  const content = completion?.choices?.[0]?.message?.content;
  console.log("[CALL] Got response, length:", content?.length || 0);

  if (!content) throw new Error("Groq returned empty response");

  try {
    return JSON.parse(content);
  } catch (e) {
    console.error("[CALL] Bad JSON:", content);
    throw new Error("Groq returned invalid JSON");
  }
}

export async function runDecide(dilemma) {
  const { system, user } = buildDecidePrompt(dilemma);
  const raw = await callGroq({ system, user });
  return normaliseDecide(raw);
}

export async function runNavigate(problem) {
  const { system, user } = buildNavigatePrompt(problem);
  const raw = await callGroq({ system, user });
  return normaliseNavigate(raw);
}

export async function runAnalyze(contract) {
  const { system, user } = buildAnalyzePrompt(contract);
  const raw = await callGroq({ system, user });
  return normaliseAnalyze(raw);
}

function normaliseDecide(raw) {
  if (!raw || typeof raw !== "object") throw new Error("Invalid decide response");
  return {
    label: str(raw.label, "Decision"),
    options: Array.isArray(raw.options)
      ? raw.options.slice(0, 3).map(o => ({
          title: str(o?.title, "Option"),
          pros: arr(o?.pros),
          cons: arr(o?.cons)
        }))
      : [],
    recommendation: raw.recommendation && typeof raw.recommendation === "object"
      ? { choice: str(raw.recommendation.choice, ""), reasoning: str(raw.recommendation.reasoning, "") }
      : { choice: "", reasoning: "" }
  };
}

function normaliseNavigate(raw) {
  if (!raw || typeof raw !== "object") throw new Error("Invalid navigate response");
  return {
    label: str(raw.label, "Process"),
    steps: Array.isArray(raw.steps)
      ? raw.steps.slice(0, 10).map((s, i) => ({
          n: Number.isFinite(s?.n) ? s.n : i + 1,
          title: str(s?.title, `Step ${i + 1}`),
          detail: str(s?.detail, "")
        }))
      : [],
    documents: arr(raw.documents),
    tips: arr(raw.tips)
  };
}

function normaliseAnalyze(raw) {
  if (!raw || typeof raw !== "object") throw new Error("Invalid analyze response");
  const validRisk = r => ["high", "medium", "low"].includes(r) ? r : "medium";
  const clauses = (Array.isArray(raw.clauses) ? raw.clauses : []).slice(0, 8).map(c => ({
    quote: str(c?.quote, "").slice(0, 600),
    risk: validRisk(String(c?.risk || "").toLowerCase()),
    title: str(c?.title, ""),
    explanation: str(c?.explanation, ""),
    impact: str(c?.impact, ""),
    whyRisky: str(c?.whyRisky, "")
  }));
  const riskCounts = clauses.reduce((a, c) => { if (a[c.risk] != null) a[c.risk]++; return a; }, { high: 0, medium: 0, low: 0 });
  const order = { high: 0, medium: 1, low: 2 };
  return {
    label: str(raw.label, "Contract"),
    summary: str(raw.summary, "Analysis complete."),
    riskCounts,
    clauses: [...clauses].sort((a, b) => order[a.risk] - order[b.risk])
  };
}

function str(v, fallback = "") {
  if (typeof v === "string") return v.trim();
  if (v == null) return fallback;
  return String(v);
}

function arr(v) {
  if (!Array.isArray(v)) return [];
  return v.filter(x => typeof x === "string" || typeof x === "number").map(x => String(x).trim()).filter(Boolean);
}