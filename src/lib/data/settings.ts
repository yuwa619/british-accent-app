import { cache } from "react";

import { getRecentRecordings } from "@/lib/data/recordings";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type {
  DataDeletionRequest,
  Profile,
  UserSettings,
} from "@/lib/supabase/database.types";
import type { RecordingItem } from "@/lib/types";

export type SettingsSummary = {
  profile: Profile | null;
  settings: UserSettings;
  recentRecordings: RecordingItem[];
  deletionRequests: DataDeletionRequest[];
  developerMessage: string | null;
};

export const defaultUserSettings: UserSettings = {
  user_id: "mock-user",
  retain_recordings_days: 30,
  allow_ai_processing: true,
  email_reminders: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const getSettingsSummary = cache(async (): Promise<SettingsSummary> => {
  const recentRecordings = await getRecentRecordings(10);

  if (!isSupabaseConfigured()) {
    return {
      profile: null,
      settings: defaultUserSettings,
      recentRecordings,
      deletionRequests: [],
      developerMessage:
        "Supabase is not configured. Settings changes and deletion requests are simulated locally in mock mode.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      profile: null,
      settings: defaultUserSettings,
      recentRecordings: [],
      deletionRequests: [],
      developerMessage: "Sign in to manage saved privacy settings.",
    };
  }

  const [profileResult, settingsResult, requestsResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("data_deletion_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  return {
    profile: profileResult.data,
    settings: settingsResult.data ?? {
      ...defaultUserSettings,
      user_id: user.id,
    },
    recentRecordings,
    deletionRequests: requestsResult.data ?? [],
    developerMessage:
      profileResult.error || settingsResult.error || requestsResult.error
        ? "Some settings data could not be loaded. You can still update available controls."
        : null,
  };
});
