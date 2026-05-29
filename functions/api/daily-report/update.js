import { json, readStore, writeStore, incrementMap, getClientIp, readJson, PUBLIC_USER } from "../../_shared.js";

export async function onRequestPost({ request, env }) {
  try {
    const body = await readJson(request);
    const { previewRows } = body || {};

    if (!Array.isArray(previewRows) || previewRows.length === 0) {
      return json({ ok: false, error: "previewRows must be a non-empty array" }, 400);
    }

    const store = await readStore(env);
    const now = new Date().toISOString();
    const ip = getClientIp(request);
    const user = PUBLIC_USER;

    if (!store.firstAddedAt) store.firstAddedAt = now;
    store.updatedAt = now;
    store.lastAddedBy = user.username;
    store.lastAddedName = user.name;
    store.lastAddedAt = now;

    for (const row of previewRows) {
      store.totalErrors += 1;
      incrementMap(store.byIssueDesc, row.issueDesc || "Unknown");
      incrementMap(store.byDeviceNo, row.deviceNo || "Unknown");
      incrementMap(store.byQuick, row.quick || "Unknown");
      incrementMap(store.byIssueType, row.issueType || "Unknown");
      incrementMap(store.byDeviceType, row.deviceType || "Unknown");
      incrementMap(store.byRuleId, row.ruleId || "Unknown");
      incrementMap(store.byRuleLabel, row.ruleLabel || "Unknown");
      incrementMap(store.byConfidence, row.confidence || "Unknown");
    }

    store.addHistory.push({
      username: user.username,
      name: user.name,
      role: user.role,
      at: now,
      ip,
      addedRows: previewRows.length
    });

    await writeStore(env, store);

    return json({ ok: true, message: "Daily report updated", data: store });
  } catch (err) {
    return json({ ok: false, error: err.message || "Failed to update daily report" }, 500);
  }
}
