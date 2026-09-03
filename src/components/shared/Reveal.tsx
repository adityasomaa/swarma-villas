"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { clsx } from "@/lib/clsx";

/**
 * Scroll-in for a single block.
 *
 * Two traps this avoids:
 *
 * 1. An IntersectionObserver on an element inside an `overflow: hidden` parent
 *    reports a ratio of 0 forever, so the reveal never fires and the content
 *    stays invisible. The observer here uses the viewport as its root, and the
 *    component renders the element itself rather than adding a clipping box
 *    around it.
 *
 * 2. If JavaScript never runs, `opacity: 0` would hide the page permanently.
 *    The hiding class is only applied once the observer is actually attached,
 *    so a no-JS render is fully visible.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  y = 16,
  x = 0,
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  y?: number;
  x?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    setArmed(true);

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.01 },
    );
    io.observe(node);

    // Anything already on screen at mount should not wait for a scroll event.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) setShown(true);

    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={clsx(armed && "reveal", className)}
      data-shown={shown ? "true" : "false"}
      style={
        {
          "--reveal-delay": `${delay}ms`,
          "--reveal-y": `${y}px`,
          "--reveal-x": `${x}px`,
        } as React.CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
