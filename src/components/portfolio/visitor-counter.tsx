import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import {
  fetchCount,
  formatCount,
  markSessionHit,
  sessionAlreadyHit,
} from "@/lib/counter";

const VIEW_KEY = "portfolio-views";

export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const already = sessionAlreadyHit(VIEW_KEY);
      const n = await fetchCount(VIEW_KEY, already ? "get" : "up");
      if (n !== null && !cancelled) {
        setCount(n);
        if (!already) markSessionHit(VIEW_KEY);
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
      title="Approximate site views (once per visit session)"
    >
      <Eye className="h-3.5 w-3.5 text-accent" aria-hidden />
      <span className="font-mono tabular-nums text-muted">
        {formatCount(count)}
      </span>
      <span className="text-subtle">views</span>
    </span>
  );
}
