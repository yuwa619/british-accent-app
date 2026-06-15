"use client";

import { SendIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function RoleplayTextFallback({
  value,
  onChange,
  onSubmit,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="text-sm font-medium" htmlFor="roleplay-text-reply">
          Text fallback
        </label>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Type what you said, or use this if microphone permission is not
          available.
        </p>
      </div>
      <Textarea
        disabled={disabled}
        id="roleplay-text-reply"
        maxLength={1000}
        onChange={(event) => onChange(event.target.value)}
        placeholder="For example: Thank you for inviting me. I am interested in this role because..."
        value={value}
      />
      <Button
        disabled={disabled || !value.trim()}
        onClick={onSubmit}
        type="button"
      >
        <SendIcon data-icon="inline-start" />
        Send typed reply
      </Button>
    </div>
  );
}
