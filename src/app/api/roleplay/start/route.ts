import { NextResponse } from "next/server";

import {
  createMockRoleplayMessage,
  createMockRoleplaySession,
  getMockOpeningMessage,
} from "@/lib/roleplay/mock-roleplay";
import { saveMockRoleplay } from "@/lib/roleplay/mock-store";
import { getRoleplayScenario } from "@/lib/roleplay/scenarios";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type StartRequest = {
  scenarioKey?: string;
};

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as StartRequest | null;
  const scenario = getRoleplayScenario(body?.scenarioKey ?? "");

  if (!scenario) {
    return badRequest("Choose a valid roleplay scenario.");
  }

  if (!isSupabaseConfigured()) {
    const session = createMockRoleplaySession(scenario);
    const openingMessage = createMockRoleplayMessage({
      sessionId: session.id,
      sender: "assistant",
      text: getMockOpeningMessage(scenario),
    });

    saveMockRoleplay({ session, messages: [openingMessage], feedback: null });

    return NextResponse.json({
      session,
      openingMessage,
      mode: "mock",
    });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Sign in to start a roleplay session." },
      { status: 401 }
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("roleplay_sessions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", today.toISOString());

  if ((count ?? 0) >= 10) {
    return NextResponse.json(
      {
        error:
          "You have reached today's roleplay practice limit. Try another session tomorrow.",
      },
      { status: 429 }
    );
  }

  const { data: session, error: sessionError } = await supabase
    .from("roleplay_sessions")
    .insert({
      user_id: user.id,
      scenario_key: scenario.key,
      title: scenario.title,
      status: "active",
    })
    .select("*")
    .single();

  if (sessionError || !session) {
    return NextResponse.json(
      { error: "Unable to start roleplay. Please try again." },
      { status: 500 }
    );
  }

  const { data: openingMessage, error: messageError } = await supabase
    .from("roleplay_messages")
    .insert({
      session_id: session.id,
      user_id: user.id,
      sender: "assistant",
      message_text: getMockOpeningMessage(scenario),
    })
    .select("*")
    .single();

  if (messageError || !openingMessage) {
    await supabase.from("roleplay_sessions").delete().eq("id", session.id);

    return NextResponse.json(
      { error: "Unable to prepare the opening prompt." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    session,
    openingMessage,
    mode: "supabase",
  });
}
