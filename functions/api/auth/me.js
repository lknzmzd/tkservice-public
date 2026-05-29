import { json, PUBLIC_USER } from "../../_shared.js";

export async function onRequestGet() {
  return json({ ok: true, user: PUBLIC_USER });
}
