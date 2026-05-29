import { json, readStore, writeStore, createEmptyStore, getClientIp, PUBLIC_USER } from "../../_shared.js";

export async function onRequestPost({ request, env }) {
  try {
    const oldStore = await readStore(env);
    const now = new Date().toISOString();
    const ip = getClientIp(request);
    const user = PUBLIC_USER;

    const resetStore = createEmptyStore({
      resetAt: now,
      lastResetBy: user.username,
      lastResetName: user.name,
      lastResetIp: ip,
      resetHistory: [
        ...(Array.isArray(oldStore.resetHistory) ? oldStore.resetHistory : []),
        {
          username: user.username,
          name: user.name,
          role: user.role,
          at: now,
          ip
        }
      ]
    });

    await writeStore(env, resetStore);
    return json({ ok: true, message: "Daily report reset successfully", data: resetStore });
  } catch (err) {
    return json({ ok: false, error: err.message || "Failed to reset daily report" }, 500);
  }
}
