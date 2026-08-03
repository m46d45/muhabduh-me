/**
 * Hit counters via Abacus (stable free API).
 * GET  https://abacus.jasoncameron.dev/get/{namespace}/{key}
 * HIT  https://abacus.jasoncameron.dev/hit/{namespace}/{key}
 * Response: { "value": number } or { "error": "Key not found" }
 */
export const COUNTER_NAMESPACE = "muhabduh.id";

const SESSION_PREFIX = "muhabduh-hit-";

function safeKey(key: string): string {
  return key.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 64);
}

export function counterUrl(key: string, action: "get" | "up"): string {
  const k = safeKey(key);
  const path = action === "up" ? "hit" : "get";
  return `https://abacus.jasoncameron.dev/${path}/${COUNTER_NAMESPACE}/${k}`;
}

export async function fetchCount(
  key: string,
  action: "get" | "up",
): Promise<number | null> {
  try {
    const res = await fetch(counterUrl(key, action), {
      credentials: "omit",
      mode: "cors",
    });
    const data = (await res.json()) as {
      value?: number;
      count?: number;
      error?: string;
    };
    // New keys return "Key not found" until first hit
    if (data.error === "Key not found") {
      return action === "get" ? 0 : null;
    }
    if (!res.ok) return null;
    if (typeof data.value === "number") return data.value;
    if (typeof data.count === "number") return data.count;
    return null;
  } catch {
    return null;
  }
}

export function sessionAlreadyHit(key: string): boolean {
  try {
    return sessionStorage.getItem(SESSION_PREFIX + key) === "1";
  } catch {
    return false;
  }
}

export function markSessionHit(key: string): void {
  try {
    sessionStorage.setItem(SESSION_PREFIX + key, "1");
  } catch {
    /* ignore */
  }
}

export function formatCount(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}
