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
      // Count this visit first so the footer is not starved by other pills.
      const already = sessionAlreadyHit(VIEW_KEY);
      const n = await fetchCount(VIEW_KEY, already ? "get" : "up", {
        priority: true,
      });
      if (!cancelled) {
        setCount(n ?? 0);
        if (!already && n !== null) markSessionHit(VIEW_KEY);
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-deep/80 px-2.5 py-1 text-sm text-muted"
      title="Approximate site views (once per visit session)"
    >
      <Eye className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
      <span className="font-mono tabular-nums font-medium text-ink">
        {count === null ? "…" : formatCount(count)}
      </span>
      <span className="text-subtle">views</span>
    </span>
  );
}
