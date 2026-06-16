import { cn } from "@/lib/utils";

type ProgressRingProps = {
  /** 0–100 */
  value: number;
  size?: number;
  strokeWidth?: number;
  /** Tailwind text-* colour class used for the progress arc. */
  colorClassName?: string;
  trackClassName?: string;
  className?: string;
  /** Accessible description of what the ring represents. */
  label: string;
  children?: React.ReactNode;
};

export function ProgressRing({
  value,
  size = 88,
  strokeWidth = 8,
  colorClassName = "text-primary",
  trackClassName = "text-muted",
  className,
  label,
  children,
}: ProgressRingProps) {
  const safeValue = Math.min(100, Math.max(0, Math.round(value)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (safeValue / 100) * circumference;

  return (
    <div
      className={cn("relative inline-grid place-items-center", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${label}: ${safeValue}%`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={trackClassName}
          stroke="currentColor"
          opacity={0.35}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={cn(
            "transition-[stroke-dashoffset] duration-700 ease-out",
            colorClassName
          )}
          stroke="currentColor"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      {children ? (
        <div className="absolute inset-0 grid place-items-center text-center">
          {children}
        </div>
      ) : null}
    </div>
  );
}
