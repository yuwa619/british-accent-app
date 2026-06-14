import { cache } from "react";

import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { RecordingItem, RecordingType } from "@/lib/types";

export const getRecentRecordings = cache(
  async (limit = 6): Promise<RecordingItem[]> => {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from("recordings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return [];
    }

    return data ?? [];
  }
);

export const getRecentRecordingsByType = cache(
  async (recordingType: RecordingType, limit = 6): Promise<RecordingItem[]> => {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from("recordings")
      .select("*")
      .eq("user_id", user.id)
      .eq("recording_type", recordingType)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return [];
    }

    return data ?? [];
  }
);
