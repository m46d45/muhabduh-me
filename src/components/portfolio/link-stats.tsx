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
  /** Stable id for this link (e.g. software-parade-streamlit) */
  trackId: string;
  className?: string;
};

/**
 * Displays click count under a link. Call `recordClick` from the parent
 * when the user activates the link, or wrap with TrackedLink.
 */
export function LinkStats({ trackId, className }: LinkStatsProps) {
  const [count, setCount] = useState<number | null>(null);
  const key = `click-${trackId}`;

  useEffect(() => {
    let cancelled = false;
    void fetchCount(key, "get").then((n) => {
      if (!cancelled && n !== null) setCount(n);
    });
    return () => {
      cancelled = true;
    };
  }, [key]);

  if (count === null) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 text-xs text-subtle",
          className,
        )}
        aria-hidden
      >
        <Eye className="h-3 w-3" />
        <span className="font-mono tabular-nums">…</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs text-subtle",
        className,
      )}
      title="Clicks on this link"
    >
      <Eye className="h-3 w-3 text-accent/80" aria-hidden />
      <span className="font-mono tabular-nums text-muted">
        {formatCount(count)}
      </span>
      <span>clicks</span>
    </span>
  );
}

/** Fire-and-forget click increment (deduped per session optional) */
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
  /** Show stats row under children */
  showStats?: boolean;
  statsClassName?: string;
  target?: string;
  rel?: string;
  "aria-label"?: string;
};

/**
 * External (or any) link that records clicks and optionally shows stats below.
 */
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
      if (!cancelled && n !== null) setCount(n);
    });
    return () => {
      cancelled = true;
    };
  }, [key]);

  async function onClick(_e: MouseEvent<HTMLAnchorElement>) {
    const n = await recordLinkClick(trackId);
    if (n !== null) setCount(n);
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
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
            "inline-flex items-center gap-1 text-xs text-subtle",
            statsClassName,
          )}
          title="Clicks on this link"
        >
          <Eye className="h-3 w-3 text-accent/80" aria-hidden />
          {count === null ? (
            <span className="font-mono tabular-nums" aria-hidden>
              …
            </span>
          ) : (
            <>
              <span className="font-mono tabular-nums text-muted">
                {formatCount(count)}
              </span>
              <span>clicks</span>
            </>
          )}
        </span>
      )}
    </span>
  );
}
