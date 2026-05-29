import { json, PUBLIC_USER } from "../../_shared.js";

export async function onRequestPost() {
  return json({ ok: true, token: "public-access", user: PUBLIC_USER });
}
