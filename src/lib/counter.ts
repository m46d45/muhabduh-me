/** Free CounterAPI — namespace shared with site visitor counter */
export const COUNTER_NAMESPACE = "muhabduh-id";

const SESSION_PREFIX = "muhabduh-click-";

export function counterUrl(key: string, action: "get" | "up"): string {
  const safe = key.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 64);
  return `https://api.counterapi.dev/v1/${COUNTER_NAMESPACE}/${safe}/${action}`;
}

export async function fetchCount(
  key: string,
  action: "get" | "up",
): Promise<number | null> {
  try {
    const res = await fetch(counterUrl(key, action), { credentials: "omit" });
    if (!res.ok) return null;
    const data = (await res.json()) as { count?: number };
    return typeof data.count === "number" ? data.count : null;
  } catch {
    return null;
  }
}

/** Once per tab session per key — avoids double-count on Strict Mode remount */
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
