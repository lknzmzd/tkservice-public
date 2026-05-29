import { json, getKv } from "../_shared.js";

export async function onRequestGet({ env }) {
  return json({
    ok: true,
    service: "tkservice-daily-report-pages",
    runtime: "cloudflare-pages-functions",
    publicAccessMode: true,
    kvBound: Boolean(getKv(env))
  });
}
