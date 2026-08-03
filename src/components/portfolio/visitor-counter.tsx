import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

/**
 * Lightweight page-view counter via CounterAPI (no signup, no cookies from us).
 * Counts once per browser tab session so reloads in the same session don't
 * inflate the number as much as raw hits.
 */
const COUNTER_NAMESPACE = "muhabduh-id";
const COUNTER_KEY = "portfolio-views";
const SESSION_FLAG = "muhabduh-view-counted";

function formatCount(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const already =
          typeof sessionStorage !== "undefined" &&
          sessionStorage.getItem(SESSION_FLAG) === "1";

        const path = already ? "get" : "up";
        const res = await fetch(
          `https://api.counterapi.dev/v1/${COUNTER_NAMESPACE}/${COUNTER_KEY}/${path}`,
          { credentials: "omit" },
        );
        if (!res.ok) return;
        const data = (await res.json()) as { count?: number };
        if (typeof data.count === "number" && !cancelled) {
          setCount(data.count);
          if (!already && typeof sessionStorage !== "undefined") {
            sessionStorage.setItem(SESSION_FLAG, "1");
          }
        }
      } catch {
        // Stay silent if the counter service is unreachable
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  if (count === null) {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-sm text-subtle"
        aria-hidden
      >
        <Eye className="h-3.5 w-3.5" />
        <span className="font-mono tabular-nums">…</span>
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 text-sm text-subtle"
      title="Approximate page views (once per visit session)"
    >
      <Eye className="h-3.5 w-3.5 text-accent" aria-hidden />
      <span className="font-mono tabular-nums text-muted">
        {formatCount(count)}
      </span>
      <span className="text-subtle">views</span>
    </span>
  );
}
