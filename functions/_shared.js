const STORE_KEY = "daily-report-v1";

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

export function createEmptyStore(previous = {}) {
  return {
    reportDate: new Date().toISOString().slice(0, 10),
    totalErrors: 0,
    byIssueDesc: {},
    byDeviceNo: {},
    byQuick: {},
    byIssueType: {},
    byDeviceType: {},
    byRuleId: {},
    byRuleLabel: {},
    byConfidence: {},
    firstAddedAt: null,
    updatedAt: null,

    lastAddedBy: previous.lastAddedBy || null,
    lastAddedName: previous.lastAddedName || null,
    lastAddedAt: previous.lastAddedAt || null,
    addHistory: Array.isArray(previous.addHistory) ? previous.addHistory : [],

    resetAt: previous.resetAt || null,
    lastResetBy: previous.lastResetBy || null,
    lastResetName: previous.lastResetName || null,
    lastResetIp: previous.lastResetIp || null,
    resetHistory: Array.isArray(previous.resetHistory) ? previous.resetHistory : []
  };
}

export function getKv(env) {
  return env.TKS_DAILY_REPORT || env.DAILY_REPORT_KV || null;
}

export async function readStore(env) {
  const kv = getKv(env);
  if (!kv) {
    throw new Error("Missing KV binding: TKS_DAILY_REPORT");
  }

  const raw = await kv.get(STORE_KEY);
  if (!raw) {
    const initial = createEmptyStore();
    await kv.put(STORE_KEY, JSON.stringify(initial));
    return initial;
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      ...createEmptyStore(parsed),
      ...parsed,
      addHistory: Array.isArray(parsed.addHistory) ? parsed.addHistory : [],
      resetHistory: Array.isArray(parsed.resetHistory) ? parsed.resetHistory : []
    };
  } catch {
    const fallback = createEmptyStore();
    await kv.put(STORE_KEY, JSON.stringify(fallback));
    return fallback;
  }
}

export async function writeStore(env, data) {
  const kv = getKv(env);
  if (!kv) {
    throw new Error("Missing KV binding: TKS_DAILY_REPORT");
  }
  await kv.put(STORE_KEY, JSON.stringify(data));
}

export function incrementMap(mapObj, key, amount = 1) {
  const safeKey = String(key || "Unknown").trim() || "Unknown";
  mapObj[safeKey] = (mapObj[safeKey] || 0) + amount;
}

export function getClientIp(request) {
  return request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    null;
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export const PUBLIC_USER = {
  id: "public",
  username: "public",
  name: "Public User",
  role: "operator"
};
