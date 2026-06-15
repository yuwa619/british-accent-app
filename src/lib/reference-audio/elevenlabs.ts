import { referenceAudioEnv } from "@/lib/reference-audio/env";

export async function generateElevenLabsReferenceAudio({
  text,
}: {
  text: string;
  voiceStyle: string;
}) {
  if (!referenceAudioEnv.apiKey || !referenceAudioEnv.voiceId) {
    throw new Error("ElevenLabs is not configured.");
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${referenceAudioEnv.voiceId}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": referenceAudioEnv.apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_flash_v2_5",
        voice_settings: {
          stability: 0.55,
          similarity_boost: 0.75,
          style: 0.2,
          use_speaker_boost: true,
        },
        pronunciation_dictionary_locators: [],
        apply_text_normalization: "auto",
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`ElevenLabs request failed with ${response.status}.`);
  }

  return response.arrayBuffer();
}
