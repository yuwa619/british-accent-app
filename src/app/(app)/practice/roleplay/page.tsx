import { PageHeader } from "@/components/app/page-header";
import { RoleplayWorkspace } from "@/components/roleplay/roleplay-workspace";
import { getRecentRoleplaySessions } from "@/lib/data/roleplay";
import { roleplayScenarios } from "@/lib/roleplay/scenarios";

export default async function RoleplayPage() {
  const recentSessions = await getRecentRoleplaySessions(6);

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Roleplay"
        title="Practise UK workplace conversations turn by turn."
        description="Choose a realistic scenario, reply by voice or text, and finish with a concise confidence-focused practice summary."
      />

      <RoleplayWorkspace
        initialRecentSessions={recentSessions}
        scenarios={roleplayScenarios}
      />
    </section>
  );
}
