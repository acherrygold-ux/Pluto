const EVENT_NAME = "lifeops:insights:refresh";

export function emitInsightsRefresh() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function onInsightsRefresh(handler) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}

export async function fetchHistory({ limit = 10, type = null } = {}) {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  if (type) params.set("type", type);
  const res = await fetch(`/api/history?${params.toString()}`);
  if (!res.ok) throw new Error("History fetch failed");
  return res.json();
}