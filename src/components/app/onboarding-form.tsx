"use client";

import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";

import {
  saveOnboardingAction,
  type OnboardingActionState,
} from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { OnboardingOption } from "@/lib/types";

const levelOptions: OnboardingOption[] = [
  {
    label: "I speak English confidently but want clearer British pronunciation",
    description: "Best if you already speak regularly and want polish.",
  },
  {
    label: "I can communicate well but struggle in fast UK conversations",
    description: "Useful for meetings, calls, and quick informal exchanges.",
  },
  {
    label: "I feel nervous speaking at work or in interviews",
    description: "Focus on confidence, pacing, and prepared responses.",
  },
  {
    label: "I am preparing for UK job interviews or presentations",
    description: "Practise structured answers and professional rhythm.",
  },
];

const goalOptions = [
  "Job interviews",
  "Workplace meetings",
  "Customer-facing conversations",
  "University/seminars",
  "Healthcare/public sector communication",
  "Everyday UK conversations",
];

const situationOptions = [
  "Introducing myself",
  "Speaking in meetings",
  "Answering interview questions",
  "Making phone calls",
  "Handling customers/patients",
  "Small talk with colleagues",
  "Asking for clarification",
];

const initialState: OnboardingActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} size="lg" type="submit">
      {pending ? "Saving..." : "Save and open dashboard"}
    </Button>
  );
}

export function OnboardingForm({ mockMode }: { mockMode: boolean }) {
  const [state, action] = useActionState(saveOnboardingAction, initialState);
  const [selectedSituations, setSelectedSituations] = useState<string[]>([]);

  const situationSummary = useMemo(() => {
    if (!selectedSituations.length) return "Choose at least one situation.";
    return `${selectedSituations.length} selected`;
  }, [selectedSituations.length]);

  return (
    <form action={action} className="flex flex-col gap-8">
      <FieldGroup>
        <Field data-invalid={Boolean(state.fieldErrors?.nativeLanguage)}>
          <FieldLabel htmlFor="nativeLanguage">Native language</FieldLabel>
          <Input
            aria-invalid={Boolean(state.fieldErrors?.nativeLanguage)}
            id="nativeLanguage"
            name="nativeLanguage"
            placeholder="e.g. Spanish, Arabic, Mandarin"
          />
          <FieldError>{state.fieldErrors?.nativeLanguage}</FieldError>
        </Field>

        <FieldSet>
          <FieldLegend>Current spoken English confidence</FieldLegend>
          <FieldDescription>
            Pick the statement that feels closest today.
          </FieldDescription>
          <div className="grid gap-3">
            {levelOptions.map((option) => (
              <label
                className="flex cursor-pointer gap-3 rounded-lg border bg-background p-4 hover:bg-muted/50"
                key={option.label}
              >
                <input
                  className="mt-1"
                  name="currentLevel"
                  required
                  type="radio"
                  value={option.label}
                />
                <span className="flex flex-col gap-1">
                  <span className="font-medium">{option.label}</span>
                  <span className="text-sm text-muted-foreground">
                    {option.description}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </FieldSet>

        <Field data-invalid={Boolean(state.fieldErrors?.primaryGoal)}>
          <FieldLabel htmlFor="primaryGoal">Main goal</FieldLabel>
          <select
            aria-invalid={Boolean(state.fieldErrors?.primaryGoal)}
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            id="primaryGoal"
            name="primaryGoal"
            required
          >
            <option value="">Choose your main goal</option>
            {goalOptions.map((goal) => (
              <option key={goal} value={goal}>
                {goal}
              </option>
            ))}
          </select>
          <FieldError>{state.fieldErrors?.primaryGoal}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="profession">Profession or role</FieldLabel>
          <Input
            id="profession"
            name="profession"
            placeholder="e.g. nurse, software engineer, student"
          />
        </Field>

        <FieldSet>
          <FieldLegend>Target situations</FieldLegend>
          <FieldDescription>{situationSummary}</FieldDescription>
          <div className="grid gap-3 sm:grid-cols-2">
            {situationOptions.map((situation) => (
              <Field
                className="rounded-lg border bg-background p-3"
                key={situation}
                orientation="horizontal"
              >
                <Checkbox
                  id={`situation-${situation}`}
                  name="targetSituations"
                  onCheckedChange={(checked) => {
                    setSelectedSituations((current) =>
                      checked
                        ? [...current, situation]
                        : current.filter((item) => item !== situation)
                    );
                  }}
                  value={situation}
                />
                <FieldLabel htmlFor={`situation-${situation}`}>
                  {situation}
                </FieldLabel>
              </Field>
            ))}
          </div>
        </FieldSet>

        <Field>
          <FieldLabel htmlFor="currentChallenge">Current challenge</FieldLabel>
          <Textarea
            id="currentChallenge"
            name="currentChallenge"
            placeholder="Tell us where speaking in the UK currently feels hardest."
            rows={4}
          />
        </Field>

        <Field
          className="rounded-lg border bg-secondary/50 p-4"
          orientation="horizontal"
        >
          <Checkbox
            defaultChecked
            id="allowAiProcessing"
            name="allowAiProcessing"
            value="yes"
          />
          <div className="flex flex-col gap-1">
            <FieldLabel htmlFor="allowAiProcessing">
              I consent to AI processing for future voice analysis
            </FieldLabel>
            <FieldDescription>
              Recording features are not active yet. Before any voice upload, we
              will show a dedicated consent step and retention controls.
            </FieldDescription>
          </div>
        </Field>
      </FieldGroup>

      {state.message ? <FieldError>{state.message}</FieldError> : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SubmitButton />
        <p className="text-sm text-muted-foreground">
          {mockMode
            ? "Mock mode: submitting will take you to the dashboard without saving."
            : "Your answers help shape lesson recommendations."}
        </p>
      </div>
    </form>
  );
}
