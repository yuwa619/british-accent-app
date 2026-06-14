import { OnboardingForm } from "@/components/app/onboarding-form";
import { PageHeader } from "@/components/app/page-header";
import { PrivacyConsentNotice } from "@/components/app/privacy-consent-notice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getMissingSupabaseEnvKeys,
  isSupabaseConfigured,
} from "@/lib/supabase/env";

export default function OnboardingPage() {
  const mockMode = !isSupabaseConfigured();

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Speaking profile"
        title="Shape your practice around real UK conversations."
        description="Tell us about your language background, speaking confidence, and the situations where you want clearer, calmer speech."
      />

      {mockMode ? (
        <Card>
          <CardHeader>
            <CardTitle>Developer mock mode</CardTitle>
            <CardDescription>
              Supabase env vars are missing:{" "}
              {getMissingSupabaseEnvKeys().join(", ")}. The form remains usable
              and will route to the dashboard without saving.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>What this is for</CardTitle>
              <CardDescription>
                Your profile helps prioritise lessons such as British vowels,
                sentence stress, interview answers, and phone-call clarity.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-muted-foreground">
              The goal is not to erase your accent. The coach focuses on
              intelligibility, confidence, rhythm, and practical communication
              in UK professional settings.
            </CardContent>
          </Card>
          <PrivacyConsentNotice />
        </aside>

        <Card>
          <CardHeader>
            <CardTitle>Your goals</CardTitle>
            <CardDescription>
              You can adjust these later from settings as your practice changes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OnboardingForm mockMode={mockMode} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
