import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import {
  fetchCount,
  formatCount,
  markSessionHit,
  sessionAlreadyHit,
} from "@/lib/counter";

const VIEW_KEY = "portfolio-views";

/** Small footer-only view tally for the site owner’s own notes. */
export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
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
      className="inline-flex items-center gap-1 text-[0.7rem] text-subtle"
      title="Approximate site views (once per visit session) — personal note"
    >
      <Eye className="h-3 w-3 shrink-0 opacity-70" aria-hidden />
      <span className="font-mono tabular-nums">
        {count === null ? "…" : formatCount(count)}
      </span>
      <span className="opacity-80">views</span>
    </span>
  );
}
