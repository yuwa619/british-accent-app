import { ProgressCard } from "@/components/app/progress-card";

export function DiagnosticProgressCard({
  completedSteps,
}: {
  completedSteps: number;
}) {
  return (
    <ProgressCard
      description={`${completedSteps} of 3 diagnostic recordings analysed.`}
      footer={
        completedSteps === 3
          ? "Ready to generate your baseline."
          : "Analyse each recording before generating the report."
      }
      title="Diagnostic progress"
      value={Math.round((completedSteps / 3) * 100)}
    />
  );
}
