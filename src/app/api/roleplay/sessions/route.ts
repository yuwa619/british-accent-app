import { NextResponse } from "next/server";

import { getMockRoleplaySessions } from "@/lib/roleplay/mock-store";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      sessions: getMockRoleplaySessions().slice(0, 8),
      mode: "mock",
    });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Sign in to view roleplay sessions." },
      { status: 401 }
    );
  }

  const { data, error } = await supabase
    .from("roleplay_sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    return NextResponse.json(
      { error: "Unable to load roleplay sessions." },
      { status: 500 }
    );
  }

  return NextResponse.json({ sessions: data ?? [], mode: "supabase" });
}
