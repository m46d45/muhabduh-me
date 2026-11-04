export type RateState = { count: number; windowStart: number };

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

export function nextFailure(
  prev: RateState | undefined,
  now: number,
): { state: RateState; delayMs: number; locked: boolean; retryAfterSec: number } {
  let count = 1;
  let windowStart = now;
  if (prev && now - prev.windowStart < WINDOW_MS) {
    count = prev.count + 1;
    windowStart = prev.windowStart;
  }
  const delayMs = Math.min(800 * 2 ** (count - 1), 8000);
  const locked = count >= MAX_ATTEMPTS;
  const retryAfterSec = Math.max(1, Math.ceil((windowStart + WINDOW_MS - now) / 1000));
  return { state: { count, windowStart }, delayMs, locked, retryAfterSec };
}

const buckets = new Map<string, RateState>();

export function resetRateLimits(): void {
  buckets.clear();
}

export function registerFailure(key: string, now = Date.now()) {
  const result = nextFailure(buckets.get(key), now);
  buckets.set(key, result.state);
  return result;
}

export function clearFailures(key: string): void {
  buckets.delete(key);
}

export function lockedFailure(key: string, now = Date.now()) {
  const prev = buckets.get(key);
  if (!prev) return null;
  if (now - prev.windowStart >= WINDOW_MS) {
    buckets.delete(key);
    return null;
  }
  if (prev.count < MAX_ATTEMPTS) return null;
  return {
    retryAfterSec: Math.max(1, Math.ceil((prev.windowStart + WINDOW_MS - now) / 1000)),
  };
}
