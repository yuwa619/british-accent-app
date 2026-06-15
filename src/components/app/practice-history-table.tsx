import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { PracticeHistoryItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PracticeHistoryTable({
  rows,
}: {
  rows: PracticeHistoryItem[];
}) {
  return (
    <div className="overflow-hidden rounded-lg border bg-background">
      <div className="grid grid-cols-[1.4fr_0.8fr_0.7fr_0.7fr_0.8fr] gap-3 border-b bg-muted/60 px-4 py-3 text-xs font-medium uppercase tracking-normal text-muted-foreground">
        <span>Practice</span>
        <span>Type</span>
        <span>Date</span>
        <span>Score</span>
        <span>Status</span>
      </div>
      {rows.map((row) => (
        <div
          className="grid grid-cols-1 gap-2 border-b px-4 py-3 text-sm last:border-b-0 sm:grid-cols-[1.4fr_0.8fr_0.7fr_0.7fr_0.8fr] sm:items-center"
          key={`${row.title}-${row.date}`}
        >
          <span className="font-medium">
            {row.feedbackHref ? (
              <Link className="hover:underline" href={row.feedbackHref}>
                {row.title}
              </Link>
            ) : (
              row.title
            )}
          </span>
          <span className="text-muted-foreground">{row.type}</span>
          <span className="text-muted-foreground">{row.date}</span>
          <span className="text-muted-foreground">
            {typeof row.score === "number"
              ? `${Math.round(row.score)}/100`
              : "—"}
          </span>
          <Badge className="w-fit" variant="outline">
            {row.status}
          </Badge>
          {row.feedbackHref ? (
            <Link
              className={cn(
                buttonVariants({ size: "sm", variant: "outline" }),
                "w-fit no-underline sm:hidden"
              )}
              href={row.feedbackHref}
            >
              Open feedback
            </Link>
          ) : null}
        </div>
      ))}
    </div>
  );
}
