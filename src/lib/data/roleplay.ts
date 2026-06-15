import { cache } from "react";

import { getMockRoleplaySessions } from "@/lib/roleplay/mock-store";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { PracticeHistoryItem, RoleplaySession } from "@/lib/types";

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
}

export const getRecentRoleplaySessions = cache(
  async (limit = 5): Promise<RoleplaySession[]> => {
    if (!isSupabaseConfigured()) {
      return getMockRoleplaySessions().slice(0, limit);
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
      .from("roleplay_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) return [];

    return data ?? [];
  }
);

export function roleplaySessionsToPracticeHistory(
  sessions: RoleplaySession[]
): PracticeHistoryItem[] {
  return sessions.map((session) => ({
    title: session.title,
    type: "Roleplay",
    date: dateLabel(session.created_at),
    status: session.status === "complete" ? "Complete" : "In progress",
  }));
}
