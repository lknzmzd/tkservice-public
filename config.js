export function getApiBase() {
  const metaValue = document
    .querySelector('meta[name="tkservice-api-base"]')
    ?.getAttribute("content")
    ?.trim();

  const globalValue = typeof window !== "undefined"
    ? window.TKS_API_BASE
    : "";

  const configured = metaValue || globalValue || "";

  if (configured) {
    return String(configured).replace(/\/+$/, "");
  }

  const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  if (isLocal) {
    return "http://localhost:3002";
  }

  return window.location.origin;
}
