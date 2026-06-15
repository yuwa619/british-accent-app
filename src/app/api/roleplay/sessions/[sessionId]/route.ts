import { NextResponse } from "next/server";

import { getMockRoleplay } from "@/lib/roleplay/mock-store";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;

  if (!isSupabaseConfigured()) {
    const bundle = getMockRoleplay(sessionId);

    if (!bundle) {
      return NextResponse.json(
        { error: "Roleplay session not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ ...bundle, mode: "mock" });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Sign in to view this roleplay session." },
      { status: 401 }
    );
  }

  const [sessionResult, messagesResult] = await Promise.all([
    supabase
      .from("roleplay_sessions")
      .select("*")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("roleplay_messages")
      .select("*")
      .eq("session_id", sessionId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: true }),
  ]);

  if (sessionResult.error || !sessionResult.data) {
    return NextResponse.json(
      { error: "Roleplay session not found." },
      { status: 404 }
    );
  }

  if (messagesResult.error) {
    return NextResponse.json(
      { error: "Unable to load roleplay transcript." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    session: sessionResult.data,
    messages: messagesResult.data ?? [],
    feedback: null,
    mode: "supabase",
  });
}
