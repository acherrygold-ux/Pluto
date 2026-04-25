// Canned responses for mock mode. Ensures the demo runs without an API key.
// Responses are deterministic-ish so judges see coherent output.

export function mockDecide(dilemma) {
  const truncated = (dilemma || "").slice(0, 60).trim() || "Your dilemma";
  return {
    label: deriveLabel(dilemma, "Decision"),
    options: [
      {
        title: "Stay the course",
        pros: [
          "Zero transition cost or disruption",
          "Preserves existing relationships and momentum",
          "Lowest short-term risk"
        ],
        cons: [
          "Opportunity cost compounds silently",
          "May deepen the decision debt you already feel",
          "No new information gained"
        ]
      },
      {
        title: "Make the change now",
        pros: [
          "Resolves the mental overhead immediately",
          "Captures upside while the window is open",
          "Forces clarity on what you actually want"
        ],
        cons: [
          "Higher immediate disruption",
          "Some outcomes are irreversible",
          "Requires energy you may not have today"
        ]
      },
      {
        title: "Run a 2-week experiment",
        pros: [
          "Generates real data instead of speculation",
          "Bounded downside — easy to roll back",
          "Reduces the decision to a smaller next step"
        ],
        cons: [
          "Delays the final call",
          "Experiments can be rationalised away",
          "Requires you to define a success metric up front"
        ]
      }
    ],
    recommendation: {
      choice: "Run a 2-week experiment",
      reasoning: `For "${truncated}", a bounded experiment lets you trade speculation for evidence without the full commitment of an immediate change.`
    }
  };
}

export function mockNavigate(problem) {
  return {
    label: deriveLabel(problem, "Process"),
    steps: [
      { n: 1, title: "Gather your baseline documents",     detail: "Pull together ID, proof of address, and any prior correspondence on this issue." },
      { n: 2, title: "Confirm the correct authority",      detail: "Identify the exact department or portal responsible — wrong-desk delays are the #1 time sink." },
      { n: 3, title: "Submit through the fastest channel", detail: "Prefer online portals over in-person visits unless a wet signature is explicitly required." },
      { n: 4, title: "Log a tracking reference",           detail: "Save the reference number, screenshot the submission, and note the SLA or expected turnaround." },
      { n: 5, title: "Follow up on day T+SLA",             detail: "If you haven't heard back, escalate politely citing the reference number and SLA." },
      { n: 6, title: "Escalate if blocked",                detail: "Request a supervisor, file a formal grievance, or use the ombudsman channel if applicable." }
    ],
    documents: [
      "Government-issued photo ID",
      "Proof of address (≤ 3 months old)",
      "Prior application / reference number",
      "Supporting evidence (photos, receipts)"
    ],
    tips: [
      "Submit early in the week — Monday and Tuesday queues clear fastest.",
      "Always request a written acknowledgement, even for phone calls.",
      "Keep a single folder (physical or cloud) with every artefact for this process."
    ]
  };
}

export function mockAnalyze(contract) {
  const snippet = (contract || "").slice(0, 140).replace(/\s+/g, " ").trim() || "Clause text unavailable in preview.";
  return {
    label: deriveLabel(contract, "Contract"),
    summary: "2 high-risk and 1 medium-risk clauses detected. Review before signing.",
    clauses: [
      {
        quote: snippet,
        risk: "high",
        explanation: "This clause grants the counterparty broad discretion with limited recourse for you.",
        impact: "You could be bound to terms that change without your consent."
      },
      {
        quote: "Auto-renewal provisions apply unless written notice is given 60 days prior to the renewal date.",
        risk: "high",
        explanation: "The contract renews automatically, and the cancellation window is narrow and easy to miss.",
        impact: "Missing the 60-day window locks you in for another full term."
      },
      {
        quote: "Any dispute shall be resolved via binding arbitration in a venue selected by the Company.",
        risk: "medium",
        explanation: "You waive the right to sue in court, and the counterparty picks where disputes are heard.",
        impact: "Legal action becomes more expensive and less accessible for you."
      },
      {
        quote: "Either party may terminate with 30 days' written notice.",
        risk: "low",
        explanation: "Standard termination clause with reasonable notice in both directions.",
        impact: "Low concern — this is a fair baseline."
      }
    ]
  };
}

function deriveLabel(text, fallback) {
  if (!text) return fallback;
  const cleaned = String(text).replace(/\s+/g, " ").trim();
  if (!cleaned) return fallback;
  const words = cleaned.split(" ").slice(0, 5).join(" ");
  return words.length > 48 ? words.slice(0, 48) + "…" : words;
}