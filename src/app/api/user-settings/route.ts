import { NextResponse } from "next/server";

import { captureServerError } from "@/lib/monitoring/sentry";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

type SettingsBody = {
  retainRecordingsDays?: number;
  allowAiProcessing?: boolean;
  emailReminders?: boolean;
};

function normaliseRetention(value: unknown) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 30;
  return Math.min(Math.max(Math.round(parsed), 1), 365);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as SettingsBody;
    const retainRecordingsDays = normaliseRetention(body.retainRecordingsDays);
    const allowAiProcessing = body.allowAiProcessing !== false;
    const emailReminders = body.emailReminders === true;

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        settings: {
          user_id: "mock-user",
          retain_recordings_days: retainRecordingsDays,
          allow_ai_processing: allowAiProcessing,
          email_reminders: emailReminders,
          updated_at: new Date().toISOString(),
        },
        mode: "mock",
      });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Sign in to update privacy settings." },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("user_settings")
      .upsert(
        {
          user_id: user.id,
          retain_recordings_days: retainRecordingsDays,
          allow_ai_processing: allowAiProcessing,
          email_reminders: emailReminders,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Unable to save settings. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ settings: data, mode: "supabase" });
  } catch (error) {
    await captureServerError(error, { route: "/api/user-settings" });
    return NextResponse.json(
      { error: "Unable to save settings right now." },
      { status: 500 }
    );
  }
}
