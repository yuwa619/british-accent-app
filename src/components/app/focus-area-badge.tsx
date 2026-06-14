import { Badge } from "@/components/ui/badge";
import type { FocusArea } from "@/lib/types";

export function FocusAreaBadge({ focusArea }: { focusArea: FocusArea }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-background p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-medium">{focusArea.label}</p>
        <Badge variant="outline">P{focusArea.priority}</Badge>
      </div>
      <p className="text-sm text-muted-foreground">{focusArea.description}</p>
      <p className="text-xs font-medium uppercase tracking-normal text-muted-foreground">
        {focusArea.category}
      </p>
    </div>
  );
}
