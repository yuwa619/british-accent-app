import { aiEnv, canUseOpenAiCoach } from "@/lib/ai/env";
import {
  buildRoleplayConversationMessages,
  buildRoleplayFeedbackPrompt,
  normaliseRoleplayFeedback,
} from "@/lib/roleplay/prompts";
import {
  createMockAssistantReply,
  createMockRoleplayFeedback,
} from "@/lib/roleplay/mock-roleplay";
import type {
  RoleplayFeedback,
  RoleplayMessage,
  RoleplayScenario,
} from "@/lib/types";

type ChatCompletionPayload = {
  choices?: Array<{ message?: { content?: string | null } }>;
};

export async function generateRoleplayAssistantReply({
  scenario,
  messages,
  userText,
}: {
  scenario: RoleplayScenario;
  messages: RoleplayMessage[];
  userText: string;
}) {
  if (!canUseOpenAiCoach()) {
    return {
      text: createMockAssistantReply({
        scenario,
        userText,
        assistantTurnCount: messages.filter(
          (message) => message.sender === "assistant"
        ).length,
      }),
      provider: "mock",
      isMock: true,
    };
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${aiEnv.openAiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.45,
        max_tokens: 160,
        messages: buildRoleplayConversationMessages({
          scenario,
          messages,
          userText,
        }),
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI roleplay response failed: ${response.status}`);
    }

    const payload = (await response.json()) as ChatCompletionPayload;
    const text = payload.choices?.[0]?.message?.content?.trim();

    if (!text) {
      throw new Error("OpenAI roleplay response was empty.");
    }

    return { text, provider: "openai", isMock: false };
  } catch {
    return {
      text: createMockAssistantReply({
        scenario,
        userText,
        assistantTurnCount: messages.filter(
          (message) => message.sender === "assistant"
        ).length,
      }),
      provider: "openai-fallback",
      isMock: true,
    };
  }
}

export async function generateRoleplayFeedback({
  scenario,
  messages,
}: {
  scenario: RoleplayScenario;
  messages: RoleplayMessage[];
}): Promise<RoleplayFeedback> {
  if (!canUseOpenAiCoach()) {
    return createMockRoleplayFeedback({ scenario, messages });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${aiEnv.openAiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "You are a UK professional communication and speech confidence coach. Use British English. Focus on clarity, rhythm, structure, intelligibility, and confidence. Avoid harsh or identity-erasing language. Scores are guidance, not judgement. Return only valid JSON.",
          },
          {
            role: "user",
            content: JSON.stringify(
              buildRoleplayFeedbackPrompt({ scenario, messages })
            ),
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "roleplay_session_feedback",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              required: [
                "overall_summary",
                "clarity_score",
                "confidence_score",
                "structure_score",
                "pronunciation_rhythm_observation",
                "what_went_well",
                "one_thing_to_improve",
                "suggested_phrases",
                "recommended_next_lesson",
                "recommended_next_roleplay",
                "encouragement",
              ],
              properties: {
                overall_summary: { type: "string" },
                clarity_score: { type: "number" },
                confidence_score: { type: "number" },
                structure_score: { type: "number" },
                pronunciation_rhythm_observation: { type: "string" },
                what_went_well: { type: "string" },
                one_thing_to_improve: { type: "string" },
                suggested_phrases: {
                  type: "array",
                  items: { type: "string" },
                },
                recommended_next_lesson: {
                  type: "object",
                  additionalProperties: false,
                  required: ["title", "slug"],
                  properties: {
                    title: { type: "string" },
                    slug: { type: "string" },
                  },
                },
                recommended_next_roleplay: { type: "string" },
                encouragement: { type: "string" },
              },
            },
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI feedback response failed: ${response.status}`);
    }

    const payload = (await response.json()) as ChatCompletionPayload;
    const content = payload.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("OpenAI feedback response was empty.");
    }

    return normaliseRoleplayFeedback(JSON.parse(content) as RoleplayFeedback);
  } catch {
    return createMockRoleplayFeedback({ scenario, messages });
  }
}
