import { NextResponse } from "next/server";

import { generateRoleplayFeedback } from "@/lib/roleplay/openai-roleplay";
import { getMockRoleplay, updateMockRoleplay } from "@/lib/roleplay/mock-store";
import { getRoleplayScenario } from "@/lib/roleplay/scenarios";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { RoleplayMessage } from "@/lib/types";

export const runtime = "nodejs";

type EndRequest = {
  sessionId?: string;
  scenarioKey?: string;
};

function cleanText(value: string | null | undefined) {
  return value?.trim() ?? "";
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as EndRequest | null;
  const sessionId = cleanText(body?.sessionId);

  if (!sessionId) {
    return NextResponse.json(
      { error: "Choose an active roleplay session before ending it." },
      { status: 400 }
    );
  }

  if (!isSupabaseConfigured()) {
    const stored = getMockRoleplay(sessionId);
    const scenario =
      getRoleplayScenario(
        body?.scenarioKey ?? stored?.session.scenario_key ?? ""
      ) ?? getRoleplayScenario("uk-job-interview");

    if (!stored || !scenario) {
      return NextResponse.json(
        { error: "Roleplay session not found." },
        { status: 404 }
      );
    }

    const feedback = await generateRoleplayFeedback({
      scenario,
      messages: stored.messages,
    });
    const session = {
      ...stored.session,
      status: "complete" as const,
      summary: feedback.overall_summary,
      ended_at: new Date().toISOString(),
    };

    updateMockRoleplay(sessionId, { session, feedback });

    return NextResponse.json({
      session,
      feedback,
      mode: "mock",
    });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Sign in to end this roleplay session." },
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
      { error: "Unable to load this roleplay transcript." },
      { status: 500 }
    );
  }

  const scenario = getRoleplayScenario(sessionResult.data.scenario_key);

  if (!scenario) {
    return NextResponse.json(
      { error: "Roleplay scenario is unavailable." },
      { status: 404 }
    );
  }

  const feedback = await generateRoleplayFeedback({
    scenario,
    messages: (messagesResult.data ?? []) as RoleplayMessage[],
  });

  const { data: session, error: updateError } = await supabase
    .from("roleplay_sessions")
    .update({
      status: "complete",
      summary: feedback.overall_summary,
      ended_at: new Date().toISOString(),
    })
    .eq("id", sessionResult.data.id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (updateError || !session) {
    return NextResponse.json(
      { error: "Unable to save your roleplay summary." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    session,
    feedback,
    mode: feedback.is_mock ? "mock" : "supabase",
  });
}
