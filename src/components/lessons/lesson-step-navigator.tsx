"use client";

import { CheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const lessonFlowSteps = [
  "Learn",
  "Listen",
  "Shadow",
  "Record",
  "Compare",
  "Analyse",
  "Complete",
];

export function LessonStepNavigator({
  currentStep,
  onStepChange,
}: {
  currentStep: number;
  onStepChange: (step: number) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-7">
      {lessonFlowSteps.map((step, index) => (
        <Button
          className={cn("justify-start lg:justify-center")}
          key={step}
          onClick={() => onStepChange(index)}
          type="button"
          variant={currentStep === index ? "default" : "outline"}
        >
          {currentStep > index ? <CheckIcon data-icon="inline-start" /> : null}
          {step}
        </Button>
      ))}
    </div>
  );
}
