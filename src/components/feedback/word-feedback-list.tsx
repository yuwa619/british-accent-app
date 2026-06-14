import type { WordFeedbackItem } from "@/lib/ai/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function WordFeedbackList({ items }: { items: WordFeedbackItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Word-level notes</CardTitle>
        <CardDescription>
          Small adjustments that can make important words easier to follow.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length ? (
          items.map((item) => (
            <div
              className="rounded-lg border bg-background p-4"
              key={item.word}
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium">{item.word}</p>
                {typeof item.score === "number" ? (
                  <Badge variant="outline">{Math.round(item.score)}/100</Badge>
                ) : null}
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.issue}
              </p>
              <p className="mt-2 text-sm leading-6">{item.suggestion}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No specific word notes were returned for this recording.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
