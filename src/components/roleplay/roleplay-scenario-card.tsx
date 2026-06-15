"use client";

import { CheckIcon, MessageSquareTextIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { RoleplayScenario } from "@/lib/types";
import { cn } from "@/lib/utils";

export function RoleplayScenarioCard({
  scenario,
  isSelected,
  onSelect,
}: {
  scenario: RoleplayScenario;
  isSelected: boolean;
  onSelect: (scenario: RoleplayScenario) => void;
}) {
  return (
    <Button
      className={cn(
        "h-auto min-h-72 justify-start whitespace-normal rounded-lg border p-4 text-left",
        isSelected
          ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
          : "bg-background hover:bg-muted"
      )}
      onClick={() => onSelect(scenario)}
      type="button"
      variant="ghost"
    >
      <span className="flex w-full flex-col gap-4">
        <span className="flex items-start justify-between gap-3">
          <MessageSquareTextIcon className="mt-1 size-5 shrink-0" />
          {isSelected ? <CheckIcon className="mt-1 size-5 shrink-0" /> : null}
        </span>
        <span className="flex flex-col gap-2">
          <span className="text-lg font-semibold leading-7">
            {scenario.title}
          </span>
          <span
            className={cn(
              "text-sm leading-6",
              isSelected
                ? "text-primary-foreground/85"
                : "text-muted-foreground"
            )}
          >
            {scenario.description}
          </span>
        </span>
        <span className="flex flex-wrap gap-2">
          <Badge variant={isSelected ? "secondary" : "outline"}>
            {scenario.difficulty}
          </Badge>
          <Badge variant={isSelected ? "secondary" : "outline"}>
            {scenario.turns} turns
          </Badge>
        </span>
        <span
          className={cn(
            "text-sm leading-6",
            isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
          )}
        >
          Goal: {scenario.user_goal}
        </span>
      </span>
    </Button>
  );
}
