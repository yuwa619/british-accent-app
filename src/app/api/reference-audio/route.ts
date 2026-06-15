import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

import { generateElevenLabsReferenceAudio } from "@/lib/reference-audio/elevenlabs";
import { canUseElevenLabs } from "@/lib/reference-audio/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type ReferenceAudioRequest = {
  text?: string;
  lessonId?: string | null;
  promptId?: string | null;
  voiceStyle?: string | null;
};

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

function getHash(text: string, voiceStyle: string) {
  return createHash("sha256").update(`${voiceStyle}:${text}`).digest("hex");
}

export async function POST(request: Request) {
  const body = (await request
    .json()
    .catch(() => null)) as ReferenceAudioRequest | null;
  const text = body?.text?.trim() ?? "";
  const voiceStyle =
    body?.voiceStyle?.trim() || "clear modern British professional";

  if (!text) {
    return badRequest("Add reference text before requesting audio.");
  }

  if (text.length > 600) {
    return badRequest("Reference audio text must be under 600 characters.");
  }

  if (!canUseElevenLabs()) {
    return NextResponse.json({
      audioUrl: null,
      isMock: true,
      cached: false,
      message:
        "Reference audio generation is not enabled. Use the reference text for shadowing practice.",
    });
  }

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Sign in to generate reference audio." },
        { status: 401 }
      );
    }
  }

  const hash = getHash(text, voiceStyle);
  const storagePath = `reference-audio/${hash}.mp3`;

  if (isSupabaseConfigured() && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const admin = createAdminClient();
    const { data: signedExisting } = await admin.storage
      .from("recordings")
      .createSignedUrl(storagePath, 60 * 60);

    if (signedExisting?.signedUrl) {
      return NextResponse.json({
        audioUrl: signedExisting.signedUrl,
        isMock: false,
        cached: true,
      });
    }

    try {
      const audio = await generateElevenLabsReferenceAudio({
        text,
        voiceStyle,
      });
      const { error: uploadError } = await admin.storage
        .from("recordings")
        .upload(storagePath, audio, {
          contentType: "audio/mpeg",
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: signedUrl } = await admin.storage
        .from("recordings")
        .createSignedUrl(storagePath, 60 * 60);

      return NextResponse.json({
        audioUrl: signedUrl?.signedUrl ?? null,
        isMock: false,
        cached: false,
      });
    } catch (error) {
      console.error("Reference audio generation failed", error);

      return NextResponse.json({
        audioUrl: null,
        isMock: true,
        cached: false,
        message:
          "Reference audio could not be generated. You can still practise with the reference text.",
      });
    }
  }

  try {
    const audio = await generateElevenLabsReferenceAudio({ text, voiceStyle });
    const base64 = Buffer.from(audio).toString("base64");

    return NextResponse.json({
      audioUrl: `data:audio/mpeg;base64,${base64}`,
      isMock: false,
      cached: false,
    });
  } catch (error) {
    console.error("Reference audio generation failed", error);

    return NextResponse.json({
      audioUrl: null,
      isMock: true,
      cached: false,
      message:
        "Reference audio could not be generated. You can still practise with the reference text.",
    });
  }
}
