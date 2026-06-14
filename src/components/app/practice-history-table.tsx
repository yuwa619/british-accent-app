import { Badge } from "@/components/ui/badge";
import type { PracticeHistoryItem } from "@/lib/types";

export function PracticeHistoryTable({
  rows,
}: {
  rows: PracticeHistoryItem[];
}) {
  return (
    <div className="overflow-hidden rounded-lg border bg-background">
      <div className="grid grid-cols-[1.4fr_0.9fr_0.8fr_0.8fr] gap-3 border-b bg-muted/60 px-4 py-3 text-xs font-medium uppercase tracking-normal text-muted-foreground">
        <span>Practice</span>
        <span>Type</span>
        <span>Date</span>
        <span>Status</span>
      </div>
      {rows.map((row) => (
        <div
          className="grid grid-cols-1 gap-2 border-b px-4 py-3 text-sm last:border-b-0 sm:grid-cols-[1.4fr_0.9fr_0.8fr_0.8fr] sm:items-center"
          key={`${row.title}-${row.date}`}
        >
          <span className="font-medium">{row.title}</span>
          <span className="text-muted-foreground">{row.type}</span>
          <span className="text-muted-foreground">{row.date}</span>
          <Badge className="w-fit" variant="outline">
            {row.status}
          </Badge>
        </div>
      ))}
    </div>
  );
}
