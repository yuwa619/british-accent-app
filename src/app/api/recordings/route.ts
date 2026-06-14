import { NextResponse } from "next/server";

import {
  createMockRecording,
  getRecordingExtension,
  isAllowedRecordingType,
  maxRecordingBytes,
} from "@/lib/recordings";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

function readOptionalUuid(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function readDuration(formData: FormData) {
  const raw = formData.get("duration_seconds");
  if (typeof raw !== "string" || !raw.trim()) return null;

  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ recordings: [], mode: "mock" });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Sign in to view recordings." },
      { status: 401 }
    );
  }

  const { data, error } = await supabase
    .from("recordings")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json(
      { error: "Unable to load recordings." },
      { status: 500 }
    );
  }

  return NextResponse.json({ recordings: data ?? [], mode: "supabase" });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const audio = formData.get("audio");
  const recordingType = formData.get("recording_type");
  const lessonId = readOptionalUuid(formData, "lesson_id");
  const promptId = readOptionalUuid(formData, "prompt_id");
  const durationSeconds = readDuration(formData);

  if (!isAllowedRecordingType(recordingType)) {
    return badRequest("Choose a valid recording type.");
  }

  if (!(audio instanceof File)) {
    return badRequest("Add an audio file before saving.");
  }

  if (audio.size === 0) {
    return badRequest("The recording was empty. Please record again.");
  }

  if (audio.size > maxRecordingBytes) {
    return badRequest(
      "This recording is too large. Please record a shorter clip."
    );
  }

  if (!audio.type.startsWith("audio/")) {
    return badRequest("The uploaded file must be an audio recording.");
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      recording: createMockRecording({
        recordingType,
        durationSeconds,
        lessonId,
        promptId,
      }),
      mode: "mock",
    });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Sign in to save recordings." },
      { status: 401 }
    );
  }

  const recordingId = crypto.randomUUID();
  const extension = getRecordingExtension(audio.type);
  const storagePath = `${user.id}/${recordingId}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("recordings")
    .upload(storagePath, audio, {
      contentType: audio.type || "audio/webm",
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: "Unable to upload recording. Please try again." },
      { status: 500 }
    );
  }

  const { data: recording, error: insertError } = await supabase
    .from("recordings")
    .insert({
      id: recordingId,
      user_id: user.id,
      lesson_id: lessonId,
      prompt_id: promptId,
      recording_type: recordingType,
      storage_path: storagePath,
      duration_seconds: durationSeconds,
      status: "uploaded",
    })
    .select("*")
    .single();

  if (insertError) {
    await supabase.storage.from("recordings").remove([storagePath]);

    return NextResponse.json(
      { error: "Recording uploaded, but metadata could not be saved." },
      { status: 500 }
    );
  }

  return NextResponse.json({ recording, mode: "supabase" }, { status: 201 });
}
