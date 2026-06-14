import type { RecordingItem, RecordingType } from "@/lib/types";

export const allowedRecordingTypes: RecordingType[] = [
  "diagnostic",
  "lesson",
  "shadowing",
  "roleplay",
];

export const maxRecordingSeconds = 120;
export const maxRecordingBytes = 50 * 1024 * 1024;

const supportedMimeTypes = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4",
  "audio/ogg;codecs=opus",
  "audio/ogg",
  "audio/wav",
];

export function isAllowedRecordingType(
  value: FormDataEntryValue | string | null
): value is RecordingType {
  return (
    typeof value === "string" &&
    allowedRecordingTypes.includes(value as RecordingType)
  );
}

export function getBestSupportedAudioMimeType() {
  if (typeof MediaRecorder === "undefined") {
    return "";
  }

  return (
    supportedMimeTypes.find((mimeType) =>
      MediaRecorder.isTypeSupported(mimeType)
    ) ?? ""
  );
}

export function getRecordingExtension(mimeType: string) {
  if (mimeType.includes("mp4")) return "mp4";
  if (mimeType.includes("ogg")) return "ogg";
  if (mimeType.includes("wav")) return "wav";
  if (mimeType.includes("mpeg")) return "mp3";
  return "webm";
}

export function formatRecordingDuration(seconds: number | null | undefined) {
  const safeSeconds = Math.max(0, Math.floor(seconds ?? 0));
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

export function createMockRecording({
  recordingType,
  durationSeconds,
  lessonId,
  promptId,
}: {
  recordingType: RecordingType;
  durationSeconds?: number | null;
  lessonId?: string | null;
  promptId?: string | null;
}): RecordingItem {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  return {
    id,
    user_id: "mock-user",
    lesson_id: lessonId ?? null,
    prompt_id: promptId ?? null,
    recording_type: recordingType,
    storage_path: `mock/${id}.webm`,
    duration_seconds: durationSeconds ?? null,
    transcript: null,
    status: "uploaded",
    created_at: now,
    updated_at: now,
    is_mock: true,
  };
}

export function getRecordingTypeLabel(type: RecordingType) {
  if (type === "diagnostic") return "Diagnostic";
  if (type === "shadowing") return "Shadowing";
  if (type === "roleplay") return "Roleplay";
  return "Lesson";
}
