import { DumbbellIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function NextExerciseCard({ exercise }: { exercise: string }) {
  return (
    <Card>
      <CardHeader>
        <DumbbellIcon className="size-5 text-primary" />
        <CardTitle>Practise this next</CardTitle>
        <CardDescription>
          One focused exercise is usually more useful than trying to change
          everything at once.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="leading-7 text-muted-foreground">{exercise}</p>
      </CardContent>
    </Card>
  );
}
