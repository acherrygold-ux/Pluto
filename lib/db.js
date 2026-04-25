const store = new Map();

export function saveInsight({ id, type, label, input, output }) {
  try {
    store.set(id, {
      id,
      type,
      label: String(label || "").slice(0, 120),
      input,
      output,
      createdAt: Date.now()
    });
    return true;
  } catch {
    return false;
  }
}

export function getInsightById(id) {
  return store.get(id) || null;
}

export function listInsights({ limit = 10, type = null } = {}) {
  const all = Array.from(store.values()).sort((a, b) => b.createdAt - a.createdAt);
  const filtered = type ? all.filter(x => x.type === type) : all;
  return filtered.slice(0, Math.max(1, Math.min(100, Number(limit) || 10)));
}