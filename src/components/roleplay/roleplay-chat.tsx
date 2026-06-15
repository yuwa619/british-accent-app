import { MessageSquareTextIcon } from "lucide-react";

import { RoleplayMessage } from "@/components/roleplay/roleplay-message";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  RoleplayMessage as RoleplayMessageType,
  RoleplayScenario,
} from "@/lib/types";

export function RoleplayChat({
  scenario,
  messages,
  isThinking,
}: {
  scenario: RoleplayScenario;
  messages: RoleplayMessageType[];
  isThinking: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <MessageSquareTextIcon className="size-5 text-primary" />
        <CardTitle>Conversation transcript</CardTitle>
        <CardDescription>
          Practise one turn at a time. The assistant stays in role as{" "}
          {scenario.ai_role.toLowerCase()}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex max-h-[620px] flex-col gap-3 overflow-y-auto">
        {messages.map((message) => (
          <RoleplayMessage key={message.id} message={message} />
        ))}
        {isThinking ? (
          <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
            AI coach is preparing the next prompt...
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
