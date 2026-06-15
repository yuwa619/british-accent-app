"use client";

import { RoleplayScenarioCard } from "@/components/roleplay/roleplay-scenario-card";
import type { RoleplayScenario } from "@/lib/types";

export function RoleplayScenarioSelector({
  scenarios,
  selectedScenario,
  onSelect,
}: {
  scenarios: RoleplayScenario[];
  selectedScenario: RoleplayScenario;
  onSelect: (scenario: RoleplayScenario) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {scenarios.map((scenario) => (
        <RoleplayScenarioCard
          isSelected={scenario.key === selectedScenario.key}
          key={scenario.key}
          onSelect={onSelect}
          scenario={scenario}
        />
      ))}
    </div>
  );
}
