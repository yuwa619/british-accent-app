import { CalendarDaysIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PracticePlanItem } from "@/lib/types";

export function PracticePlanCard({ items }: { items: PracticePlanItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CalendarDaysIcon className="size-5 text-primary" />
        <CardTitle>Suggested 7-day plan</CardTitle>
        <CardDescription>
          Short daily practice, designed for consistency rather than pressure.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {items.map((item) => (
          <div className="rounded-lg border bg-background p-4" key={item.day}>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Day {item.day}</Badge>
              <p className="font-medium">{item.title}</p>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {item.description}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
