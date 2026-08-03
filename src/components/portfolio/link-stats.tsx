import { useEffect, useState, type ReactNode, type MouseEvent } from "react";
import { Eye } from "lucide-react";
import {
  fetchCount,
  formatCount,
  markSessionHit,
  sessionAlreadyHit,
} from "@/lib/counter";
import { cn } from "@/lib/utils";

type LinkStatsProps = {
  trackId: string;
  className?: string;
};

export function LinkStats({ trackId, className }: LinkStatsProps) {
  const [count, setCount] = useState<number | null>(null);
  const key = `click-${trackId}`;

  useEffect(() => {
    let cancelled = false;
    void fetchCount(key, "get").then((n) => {
      if (!cancelled) setCount(n ?? 0);
    });
    return () => {
      cancelled = true;
    };
  }, [key]);

  return (
    <span
      className={cn(
        "mt-1 inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-deep/80 px-2.5 py-1 text-xs text-muted",
        className,
      )}
      title="Clicks on this link"
    >
      <Eye className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
      <span className="font-mono tabular-nums font-medium text-ink">
        {count === null ? "…" : formatCount(count)}
      </span>
      <span className="text-subtle">clicks</span>
    </span>
  );
}

export async function recordLinkClick(
  trackId: string,
  options?: { oncePerSession?: boolean },
): Promise<number | null> {
  const key = `click-${trackId}`;
  if (options?.oncePerSession && sessionAlreadyHit(key)) {
    return fetchCount(key, "get");
  }
  const n = await fetchCount(key, "up");
  if (n !== null && options?.oncePerSession) markSessionHit(key);
  return n;
}

type TrackedLinkProps = {
  href: string;
  trackId: string;
  className?: string;
  children: ReactNode;
  showStats?: boolean;
  statsClassName?: string;
  target?: string;
  rel?: string;
  "aria-label"?: string;
};

export function TrackedLink({
  href,
  trackId,
  className,
  children,
  showStats = true,
  statsClassName,
  target = "_blank",
  rel = "noopener noreferrer",
  "aria-label": ariaLabel,
}: TrackedLinkProps) {
  const [count, setCount] = useState<number | null>(null);
  const key = `click-${trackId}`;

  useEffect(() => {
    let cancelled = false;
    void fetchCount(key, "get").then((n) => {
      if (!cancelled) setCount(n ?? 0);
    });
    return () => {
      cancelled = true;
    };
  }, [key]);

  async function onClick(_e: MouseEvent<HTMLAnchorElement>) {
    const n = await recordLinkClick(trackId);
    if (n !== null) setCount(n);
    else setCount((c) => (c === null ? 1 : c + 1));
  }

  return (
    <span className="inline-flex flex-col items-start gap-1.5">
      <a
        href={href}
        target={target}
        rel={rel}
        className={className}
        aria-label={ariaLabel}
        onClick={onClick}
      >
        {children}
      </a>
      {showStats && (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-deep/80 px-2.5 py-1 text-xs text-muted",
            statsClassName,
          )}
          title="Clicks on this link"
        >
          <Eye className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
          <span className="font-mono tabular-nums font-medium text-ink">
            {count === null ? "…" : formatCount(count)}
          </span>
          <span className="text-subtle">clicks</span>
        </span>
      )}
    </span>
  );
}
