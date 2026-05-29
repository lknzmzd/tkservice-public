import { json, readStore } from "../_shared.js";

export async function onRequestGet({ env }) {
  try {
    const data = await readStore(env);
    return json({ ok: true, data });
  } catch (err) {
    return json({ ok: false, error: err.message || "Daily report load failed" }, 500);
  }
}
