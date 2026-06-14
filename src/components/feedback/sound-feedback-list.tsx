import type { SoundFeedbackItem } from "@/lib/ai/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SoundFeedbackList({ items }: { items: SoundFeedbackItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sound and rhythm focus</CardTitle>
        <CardDescription>
          Pronunciation patterns to practise in short, repeatable drills.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length ? (
          items.map((item) => (
            <div
              className="rounded-lg border bg-background p-4"
              key={item.sound}
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium">{item.sound}</p>
                <Badge variant="secondary">Priority {item.priority}</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Example: {item.example}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.issue}
              </p>
              <p className="mt-2 text-sm leading-6">{item.suggestion}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No specific sound notes were returned for this recording.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
