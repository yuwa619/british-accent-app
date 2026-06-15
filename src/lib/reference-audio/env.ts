export const referenceAudioEnv = {
  enabled: process.env.ENABLE_ELEVENLABS === "true",
  apiKey: process.env.ELEVENLABS_API_KEY,
  voiceId: process.env.ELEVENLABS_VOICE_ID,
};

export function canUseElevenLabs() {
  return Boolean(
    referenceAudioEnv.enabled &&
    referenceAudioEnv.apiKey &&
    referenceAudioEnv.voiceId
  );
}
