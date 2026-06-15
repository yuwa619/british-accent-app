import { DiagnosticSession } from "@/components/diagnostic/diagnostic-session";
import { PageHeader } from "@/components/app/page-header";
import { getLatestDiagnosticReport } from "@/lib/data/diagnostic";

export default async function DiagnosticPage() {
  const latestDiagnostic = await getLatestDiagnosticReport();

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Diagnostic"
        title="Build your clarity baseline."
        description="Record three short prompts, analyse each one, then generate a baseline report with strengths, focus areas, recommended lessons, and a 7-day practice plan."
      />

      <DiagnosticSession initialDiagnostic={latestDiagnostic} />
    </section>
  );
}
