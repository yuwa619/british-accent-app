import { NextResponse } from "next/server";

import { maybeGenerateRoleplayAudio } from "@/lib/roleplay/audio";
import { generateRoleplayAssistantReply } from "@/lib/roleplay/openai-roleplay";
import {
  createMockRoleplayMessage,
  getMockTranscript,
} from "@/lib/roleplay/mock-roleplay";
import { getMockRoleplay, updateMockRoleplay } from "@/lib/roleplay/mock-store";
import { getRoleplayScenario } from "@/lib/roleplay/scenarios";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { RoleplayMessage } from "@/lib/types";

export const runtime = "nodejs";

type TurnRequest = {
  sessionId?: string;
  scenarioKey?: string;
  recordingId?: string | null;
  transcript?: string | null;
  messageText?: string | null;
};

const maxTurnLength = 1000;

function cleanText(value: string | null | undefined) {
  return value?.trim().slice(0, maxTurnLength) ?? "";
}

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as TurnRequest | null;
  const sessionId = cleanText(body?.sessionId);

  if (!sessionId) {
    return badRequest("Choose an active roleplay session before replying.");
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

    if (
      stored.messages.filter((message) => message.sender === "user").length >=
      10
    ) {
      return NextResponse.json(
        { error: "This MVP roleplay has reached its turn limit." },
        { status: 429 }
      );
    }

    const userText =
      cleanText(body?.messageText) ||
      cleanText(body?.transcript) ||
      getMockTranscript({
        scenario,
        turnNumber: stored.messages.filter(
          (message) => message.sender === "user"
        ).length,
      });

    const userMessage = createMockRoleplayMessage({
      sessionId,
      sender: "user",
      text: userText,
      recordingId: body?.recordingId ?? null,
    });
    const assistant = await generateRoleplayAssistantReply({
      scenario,
      messages: [...stored.messages, userMessage],
      userText,
    });
    const assistantMessage = createMockRoleplayMessage({
      sessionId,
      sender: "assistant",
      text: assistant.text,
    });
    const nextMessages = [...stored.messages, userMessage, assistantMessage];

    updateMockRoleplay(sessionId, { messages: nextMessages });

    return NextResponse.json({
      userMessage,
      assistantMessage,
      mode: "mock",
    });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Sign in to continue roleplay." },
      { status: 401 }
    );
  }

  const { data: session, error: sessionError } = await supabase
    .from("roleplay_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (sessionError || !session) {
    return NextResponse.json(
      { error: "Roleplay session not found." },
      { status: 404 }
    );
  }

  if (session.status !== "active") {
    return NextResponse.json(
      { error: "This roleplay session has already ended." },
      { status: 409 }
    );
  }

  const scenario = getRoleplayScenario(session.scenario_key);

  if (!scenario) {
    return NextResponse.json(
      { error: "Roleplay scenario is unavailable." },
      { status: 404 }
    );
  }

  const { data: messages, error: messagesError } = await supabase
    .from("roleplay_messages")
    .select("*")
    .eq("session_id", session.id)
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (messagesError) {
    return NextResponse.json(
      { error: "Unable to load roleplay transcript." },
      { status: 500 }
    );
  }

  const currentMessages = (messages ?? []) as RoleplayMessage[];
  const userTurnCount = currentMessages.filter(
    (message) => message.sender === "user"
  ).length;

  if (userTurnCount >= 10) {
    return NextResponse.json(
      { error: "This MVP roleplay has reached its turn limit." },
      { status: 429 }
    );
  }

  let userText = cleanText(body?.messageText) || cleanText(body?.transcript);
  const recordingId = cleanText(body?.recordingId) || null;

  if (recordingId) {
    const { data: recording } = await supabase
      .from("recordings")
      .select("id, user_id, transcript, recording_type")
      .eq("id", recordingId)
      .eq("user_id", user.id)
      .eq("recording_type", "roleplay")
      .maybeSingle();

    if (!recording) {
      return NextResponse.json(
        { error: "Roleplay recording not found." },
        { status: 404 }
      );
    }

    userText =
      userText ||
      cleanText(recording.transcript) ||
      getMockTranscript({ scenario, turnNumber: userTurnCount });
  }

  if (!userText) {
    return badRequest("Add a typed reply or submit a recorded roleplay turn.");
  }

  const { data: userMessage, error: userMessageError } = await supabase
    .from("roleplay_messages")
    .insert({
      session_id: session.id,
      user_id: user.id,
      sender: "user",
      message_text: userText,
      recording_id: recordingId,
    })
    .select("*")
    .single();

  if (userMessageError || !userMessage) {
    return NextResponse.json(
      { error: "Unable to save your reply." },
      { status: 500 }
    );
  }

  const assistant = await generateRoleplayAssistantReply({
    scenario,
    messages: [...currentMessages, userMessage as RoleplayMessage],
    userText,
  });
  const assistantMessageId = crypto.randomUUID();
  const audio = await maybeGenerateRoleplayAudio({
    text: assistant.text,
    sessionId: session.id,
    messageId: assistantMessageId,
  });
  const { data: assistantMessage, error: assistantMessageError } =
    await supabase
      .from("roleplay_messages")
      .insert({
        id: assistantMessageId,
        session_id: session.id,
        user_id: user.id,
        sender: "assistant",
        message_text: assistant.text,
        audio_storage_path: audio.storagePath,
      })
      .select("*")
      .single();

  if (assistantMessageError || !assistantMessage) {
    return NextResponse.json(
      { error: "Your reply was saved, but the assistant could not respond." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    userMessage,
    assistantMessage: {
      ...assistantMessage,
      audio_url: audio.audioUrl,
    },
    provider: assistant.provider,
    mode: assistant.isMock ? "mock" : "supabase",
  });
}
