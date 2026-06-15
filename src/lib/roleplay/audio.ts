import { generateElevenLabsReferenceAudio } from "@/lib/reference-audio/elevenlabs";
import { canUseElevenLabs } from "@/lib/reference-audio/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function maybeGenerateRoleplayAudio({
  text,
  sessionId,
  messageId,
}: {
  text: string;
  sessionId: string;
  messageId: string;
}) {
  if (!canUseElevenLabs()) {
    return {
      audioUrl: null,
      storagePath: null,
      isMock: true,
    };
  }

  try {
    const audio = await generateElevenLabsReferenceAudio({
      text,
      voiceStyle: "clear modern British workplace conversation",
    });

    if (isSupabaseConfigured() && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const storagePath = `roleplay-audio/${sessionId}/${messageId}.mp3`;
      const admin = createAdminClient();
      const { error: uploadError } = await admin.storage
        .from("recordings")
        .upload(storagePath, audio, {
          contentType: "audio/mpeg",
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = await admin.storage
        .from("recordings")
        .createSignedUrl(storagePath, 60 * 60);

      return {
        audioUrl: data?.signedUrl ?? null,
        storagePath,
        isMock: false,
      };
    }

    return {
      audioUrl: `data:audio/mpeg;base64,${Buffer.from(audio).toString("base64")}`,
      storagePath: null,
      isMock: false,
    };
  } catch (error) {
    console.error("Roleplay assistant audio generation failed", error);

    return {
      audioUrl: null,
      storagePath: null,
      isMock: true,
    };
  }
}
