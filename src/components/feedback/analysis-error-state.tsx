import Link from "next/link";
import { AlertCircleIcon } from "lucide-react";

import { EmptyState } from "@/components/app/empty-state";

export function AnalysisErrorState({
  title = "Feedback is not available yet",
  description = "Analyse a saved recording first, then return here to view your coaching notes.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-12 sm:px-6 lg:px-8">
      <EmptyState
        actionHref="/lessons"
        actionLabel="Open lessons"
        description={description}
        icon={AlertCircleIcon}
        title={title}
      />
      <Link
        className="text-center text-sm text-muted-foreground"
        href="/dashboard"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
