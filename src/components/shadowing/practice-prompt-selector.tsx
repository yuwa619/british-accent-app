"use client";

import { CheckIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ShadowingPrompt } from "@/lib/shadowing-prompts";
import { cn } from "@/lib/utils";

export function PracticePromptSelector({
  prompts,
  selectedKey,
  onSelect,
}: {
  prompts: ShadowingPrompt[];
  selectedKey: string;
  onSelect: (prompt: ShadowingPrompt) => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {prompts.map((prompt) => {
        const isSelected = prompt.key === selectedKey;

        return (
          <Button
            className={cn(
              "h-auto min-h-36 justify-start whitespace-normal rounded-lg border p-4 text-left",
              isSelected
                ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-background hover:bg-muted"
            )}
            key={prompt.key}
            onClick={() => onSelect(prompt)}
            type="button"
            variant="ghost"
          >
            <span className="flex w-full flex-col gap-3">
              <span className="flex items-start justify-between gap-3">
                <span className="text-base font-semibold leading-6">
                  {prompt.title}
                </span>
                {isSelected ? (
                  <CheckIcon className="mt-1 size-4 shrink-0" />
                ) : null}
              </span>
              <span
                className={cn(
                  "text-sm leading-6",
                  isSelected
                    ? "text-primary-foreground/85"
                    : "text-muted-foreground"
                )}
              >
                {prompt.description}
              </span>
              <span className="flex flex-wrap gap-2">
                <Badge variant={isSelected ? "secondary" : "outline"}>
                  {prompt.category}
                </Badge>
                <Badge variant={isSelected ? "secondary" : "outline"}>
                  {prompt.focus}
                </Badge>
              </span>
            </span>
          </Button>
        );
      })}
    </div>
  );
}
