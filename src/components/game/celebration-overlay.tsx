"use client";

import { useEffect, useMemo } from "react";
import { PartyPopperIcon, XIcon, ZapIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

const CONFETTI_COLOURS = [
  "var(--streak)",
  "var(--xp)",
  "var(--success)",
  "var(--primary)",
  "var(--warning)",
];

type ConfettiPiece = {
  left: number;
  delay: number;
  duration: number;
  drift: number;
  colour: string;
};

function buildConfetti(count: number): ConfettiPiece[] {
  // Runs only on the client (overlay is closed during SSR), so randomness is
  // safe and never causes a hydration mismatch.
  return Array.from({ length: count }).map(() => ({
    left: Math.round(Math.random() * 100),
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 1.5,
    drift: Math.round((Math.random() - 0.5) * 200),
    colour:
      CONFETTI_COLOURS[Math.floor(Math.random() * CONFETTI_COLOURS.length)],
  }));
}

export function CelebrationOverlay({
  open,
  onClose,
  title,
  subtitle,
  xpEarned,
  autoCloseMs = 6000,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  xpEarned?: number;
  autoCloseMs?: number;
}) {
  const confetti = useMemo(() => (open ? buildConfetti(48) : []), [open]);

  useEffect(() => {
    if (!open) return;

    const timer = window.setTimeout(onClose, autoCloseMs);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, autoCloseMs]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Practice complete celebration"
    >
      <button
        type="button"
        aria-label="Dismiss celebration"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-foreground/40 backdrop-blur-sm"
      />

      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        {confetti.map((piece, index) => (
          <span
            key={index}
            className="coach-confetti-piece"
            style={{
              left: `${piece.left}%`,
              backgroundColor: piece.colour,
              ["--confetti-delay" as string]: `${piece.delay}s`,
              ["--confetti-duration" as string]: `${piece.duration}s`,
              ["--confetti-x" as string]: `${piece.drift}px`,
            }}
          />
        ))}
      </div>

      <div className="animate-pop-in relative w-full max-w-sm rounded-3xl bg-card p-6 text-center shadow-xl ring-1 ring-foreground/10">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3"
        >
          <XIcon />
        </Button>

        <div className="mx-auto grid size-16 place-items-center rounded-full bg-success/15 text-success">
          <PartyPopperIcon className="size-8" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-xl font-semibold">{title}</h2>
        {subtitle ? (
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {subtitle}
          </p>
        ) : null}
        {typeof xpEarned === "number" ? (
          <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-xp/12 px-3 py-1.5 text-sm font-semibold text-xp">
            <ZapIcon className="size-4" aria-hidden="true" />+{xpEarned} XP
            earned
          </p>
        ) : null}
        <Button
          type="button"
          onClick={onClose}
          className="tap-scale mt-5 w-full"
          size="lg"
        >
          Keep going
        </Button>
      </div>
    </div>
  );
}
