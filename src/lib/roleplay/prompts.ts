import type {
  RoleplayFeedback,
  RoleplayMessage,
  RoleplayScenario,
} from "@/lib/types";

export function buildRoleplaySystemPrompt(scenario: RoleplayScenario) {
  return [
    "You are running a turn-based UK professional speaking practice roleplay.",
    `Scenario: ${scenario.title}`,
    `Your role: ${scenario.ai_role}`,
    `User goal: ${scenario.user_goal}`,
    `Focus skills: ${scenario.focus_skills.join(", ")}`,
    "Stay in the scenario and ask one question or give one response at a time.",
    "Use natural British English. Keep replies concise: 1-3 short sentences.",
    "Do not overcorrect during the conversation. Save detailed coaching for the end summary.",
    "Do not claim to be a real employer, recruiter, clinician, customer, official authority, or legal adviser.",
    "Do not give legal, medical, immigration, or financial advice.",
    "Focus on speaking practice, clarity, confidence, and professional communication.",
  ].join("\n");
}

export function buildRoleplayConversationMessages({
  scenario,
  messages,
  userText,
}: {
  scenario: RoleplayScenario;
  messages: RoleplayMessage[];
  userText: string;
}) {
  return [
    { role: "system", content: buildRoleplaySystemPrompt(scenario) },
    ...messages.slice(-8).map((message) => ({
      role: message.sender === "assistant" ? "assistant" : "user",
      content: message.message_text ?? "",
    })),
    { role: "user", content: userText },
  ];
}

export function buildRoleplayFeedbackPrompt({
  scenario,
  messages,
}: {
  scenario: RoleplayScenario;
  messages: RoleplayMessage[];
}) {
  return {
    scenario: {
      title: scenario.title,
      user_goal: scenario.user_goal,
      ai_role: scenario.ai_role,
      focus_skills: scenario.focus_skills,
      success_criteria: scenario.success_criteria,
    },
    transcript: messages.map((message) => ({
      sender: message.sender,
      text: message.message_text,
    })),
    required_feedback_shape: {
      overall_summary: "string",
      clarity_score: "number 0-100",
      confidence_score: "number 0-100",
      structure_score: "number 0-100",
      pronunciation_rhythm_observation: "string",
      what_went_well: "string",
      one_thing_to_improve: "string",
      suggested_phrases: ["string"],
      recommended_next_lesson: { title: "string", slug: "string" },
      recommended_next_roleplay: "string",
      encouragement: "string",
    } satisfies Record<string, unknown>,
  };
}

export function normaliseRoleplayFeedback(
  feedback: RoleplayFeedback
): RoleplayFeedback {
  const clamp = (score: number) =>
    Math.max(0, Math.min(100, Math.round(score)));

  return {
    ...feedback,
    clarity_score: clamp(feedback.clarity_score),
    confidence_score: clamp(feedback.confidence_score),
    structure_score: clamp(feedback.structure_score),
    suggested_phrases: feedback.suggested_phrases.slice(0, 4),
  };
}
