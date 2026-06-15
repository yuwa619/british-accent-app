import { BotIcon, UserRoundIcon } from "lucide-react";

import { AudioPlayer } from "@/components/recording/audio-player";
import { Badge } from "@/components/ui/badge";
import type { RoleplayMessage as RoleplayMessageType } from "@/lib/types";
import { cn } from "@/lib/utils";

export function RoleplayMessage({ message }: { message: RoleplayMessageType }) {
  const isAssistant = message.sender === "assistant";

  return (
    <article
      className={cn(
        "rounded-lg border p-4",
        isAssistant ? "bg-muted/40" : "bg-background"
      )}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {isAssistant ? (
          <BotIcon className="size-4 text-primary" />
        ) : (
          <UserRoundIcon className="size-4 text-primary" />
        )}
        <p className="font-medium">
          {isAssistant ? "AI roleplay partner" : "You"}
        </p>
        <Badge variant="outline">
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Badge>
        {message.recording_id ? (
          <Badge variant="secondary">Voice turn</Badge>
        ) : null}
      </div>
      <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
        {message.message_text}
      </p>
      {message.audio_url ? (
        <div className="mt-3">
          <AudioPlayer
            label="Assistant voice response"
            src={message.audio_url}
          />
        </div>
      ) : null}
    </article>
  );
}
