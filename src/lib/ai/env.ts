export const aiEnv = {
  enableRealAi: process.env.ENABLE_REAL_AI === "true",
  azureSpeechKey: process.env.AZURE_SPEECH_KEY,
  azureSpeechRegion: process.env.AZURE_SPEECH_REGION,
  openAiApiKey: process.env.OPENAI_API_KEY,
};

export function canUseAzureSpeech() {
  return Boolean(
    aiEnv.enableRealAi && aiEnv.azureSpeechKey && aiEnv.azureSpeechRegion
  );
}

export function canUseOpenAiCoach() {
  return Boolean(aiEnv.enableRealAi && aiEnv.openAiApiKey);
}

export function getAiMode() {
  return canUseAzureSpeech() ? "real" : "mock";
}
