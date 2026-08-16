/**
 * Hit counters via Abacus.
 * GET  https://abacus.jasoncameron.dev/get/{namespace}/{key}
 * HIT  https://abacus.jasoncameron.dev/hit/{namespace}/{key}
 *
 * Abacus rate-limits ~30 requests / 10s. The site has many counters, so
 * we cache, dedupe, and space requests so values do not fall back to 0.
 */
export const COUNTER_NAMESPACE = "muhabduh.id";

const SESSION_PREFIX = "muhabduh-hit-";
const MIN_GAP_MS = 380;
const cache = new Map<string, number>();
const inflight = new Map<string, Promise<number | null>>();
let queue: Promise<void> = Promise.resolve();
let lastStart = 0;

function safeKey(key: string): string {
  return key.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 64);
}

export function counterUrl(key: string, action: "get" | "up"): string {
  const k = safeKey(key);
  const path = action === "up" ? "hit" : "get";
  return `https://abacus.jasoncameron.dev/${path}/${COUNTER_NAMESPACE}/${k}`;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function requestCount(
  key: string,
  action: "get" | "up",
): Promise<number | null> {
  const wait = Math.max(0, MIN_GAP_MS - (Date.now() - lastStart));
  if (wait) await delay(wait);
  lastStart = Date.now();

  const res = await fetch(counterUrl(key, action), {
    credentials: "omit",
    mode: "cors",
    redirect: "follow",
  });

  if (res.status === 429) {
    await delay(1200);
    return requestCount(key, action);
  }

  const data = (await res.json()) as {
    value?: number;
    count?: number;
    error?: string;
  };

  if (data.error === "Key not found") {
    return action === "get" ? 0 : null;
  }
  if (!res.ok) return null;
  if (typeof data.value === "number") return data.value;
  if (typeof data.count === "number") return data.count;
  return null;
}

export async function fetchCount(
  key: string,
  action: "get" | "up",
  options?: { priority?: boolean },
): Promise<number | null> {
  const cacheKey = `${action}:${key}`;
  if (action === "get" && cache.has(key)) return cache.get(key) ?? 0;

  const existing = inflight.get(cacheKey);
  if (existing) return existing;

  const task = (options?.priority
    ? requestCount(key, action).then((n) => {
        if (n !== null) cache.set(key, n);
        return n;
      })
    : enqueue(async () => {
        try {
          const n = await requestCount(key, action);
          if (n !== null) cache.set(key, n);
          return n;
        } catch {
          return cache.has(key) ? (cache.get(key) ?? 0) : null;
        }
      })
  ).finally(() => {
    inflight.delete(cacheKey);
  });

  inflight.set(cacheKey, task);
  return task;
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
