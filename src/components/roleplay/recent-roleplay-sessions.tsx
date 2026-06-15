import { MessageCircleIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { RoleplaySession } from "@/lib/types";

export function RecentRoleplaySessions({
  sessions,
}: {
  sessions: RoleplaySession[];
}) {
  return (
    <Card>
      <CardHeader>
        <MessageCircleIcon className="size-5 text-primary" />
        <CardTitle>Recent sessions</CardTitle>
        <CardDescription>
          Completed and in-progress roleplays from this device or your Supabase
          account.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {sessions.length ? (
          sessions.map((session) => (
            <div
              className="rounded-lg border bg-background p-4"
              key={session.id}
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={
                    session.status === "complete" ? "secondary" : "outline"
                  }
                >
                  {session.status === "complete" ? "Complete" : "In progress"}
                </Badge>
                {session.is_mock ? <Badge variant="outline">Mock</Badge> : null}
              </div>
              <p className="mt-3 font-medium">{session.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {new Date(session.created_at).toLocaleString()}
              </p>
              {session.summary ? (
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {session.summary}
                </p>
              ) : null}
            </div>
          ))
        ) : (
          <div className="rounded-lg border bg-background p-4">
            <p className="font-medium">No roleplay sessions yet</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Start a scenario and your recent practice will appear here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
