import { saveOnboardingAction } from "@/app/auth/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default function OnboardingPage() {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3">
        <Badge variant="secondary" className="w-fit">
          Phase 2
        </Badge>
        <div className="flex max-w-3xl flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-normal text-balance sm:text-5xl">
            Onboarding
          </h1>
          <p className="text-base leading-7 text-muted-foreground sm:text-lg">
            Capture language background, confidence, and UK professional
            communication goals so the coach can recommend a useful path.
          </p>
        </div>
      </div>

      {!isSupabaseConfigured() ? (
        <Card>
          <CardHeader>
            <CardTitle>Supabase setup needed</CardTitle>
            <CardDescription>
              Add Supabase env vars to enable saving onboarding responses. The
              route remains available in local mock mode.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Your speaking goals</CardTitle>
          <CardDescription>
            This can be refined later from settings and progress.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveOnboardingAction} className="flex flex-col gap-6">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="nativeLanguage">
                  Native language
                </FieldLabel>
                <Input
                  id="nativeLanguage"
                  name="nativeLanguage"
                  placeholder="e.g. Spanish, Arabic, Mandarin"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="currentLevel">
                  Current English level
                </FieldLabel>
                <Input
                  id="currentLevel"
                  name="currentLevel"
                  placeholder="e.g. intermediate, advanced"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="primaryGoal">Primary UK goal</FieldLabel>
                <Input
                  id="primaryGoal"
                  name="primaryGoal"
                  placeholder="e.g. job interviews, meetings, phone calls"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="profession">
                  Profession or study area
                </FieldLabel>
                <Input
                  id="profession"
                  name="profession"
                  placeholder="e.g. healthcare, public sector, university"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="speakingConfidence">
                  Speaking confidence, 1 to 5
                </FieldLabel>
                <Input
                  id="speakingConfidence"
                  max={5}
                  min={1}
                  name="speakingConfidence"
                  type="number"
                />
                <FieldDescription>
                  1 means cautious, 5 means confident in most situations.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="targetSituations">
                  Target situations
                </FieldLabel>
                <Input
                  id="targetSituations"
                  name="targetSituations"
                  placeholder="e.g. interviews"
                />
                <FieldDescription>
                  Add one now. More detailed choices arrive in Phase 3.
                </FieldDescription>
              </Field>
            </FieldGroup>
            <Button className="w-fit" type="submit">
              Save and continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
