import type {
  RoleplayFeedback,
  RoleplayMessage,
  RoleplayScenario,
  RoleplaySession,
} from "@/lib/types";

const recommendedLessonsByScenario: Record<
  string,
  { title: string; slug: string }
> = {
  "uk-job-interview": {
    title: "Interview answers with clear structure and rhythm",
    slug: "interview-answers-structure-rhythm",
  },
  "introducing-yourself-at-work": {
    title: "Professional introductions in the UK",
    slug: "professional-introductions-uk",
  },
  "asking-for-clarification": {
    title: "Intonation for statements and questions",
    slug: "intonation-statements-questions",
  },
  "customer-service-conversation": {
    title: "Sentence stress for confident speaking",
    slug: "sentence-stress-confident-speaking",
  },
  "professional-phone-call": {
    title: "Connected speech: linking words smoothly",
    slug: "connected-speech-linking-smoothly",
  },
};

export function createMockRoleplaySession(
  scenario: RoleplayScenario
): RoleplaySession {
  return {
    id: `mock-roleplay-${scenario.key}-${Date.now()}`,
    user_id: "mock-user",
    scenario_key: scenario.key,
    title: scenario.title,
    status: "active",
    summary: null,
    created_at: new Date().toISOString(),
    ended_at: null,
    is_mock: true,
  };
}

export function createMockRoleplayMessage({
  sessionId,
  sender,
  text,
  recordingId = null,
  audioUrl = null,
}: {
  sessionId: string;
  sender: RoleplayMessage["sender"];
  text: string;
  recordingId?: string | null;
  audioUrl?: string | null;
}): RoleplayMessage {
  return {
    id: `mock-message-${crypto.randomUUID()}`,
    session_id: sessionId,
    user_id: "mock-user",
    sender,
    message_text: text,
    recording_id: recordingId,
    audio_storage_path: null,
    audio_url: audioUrl,
    created_at: new Date().toISOString(),
    is_mock: true,
  };
}

export function getMockOpeningMessage(scenario: RoleplayScenario) {
  return scenario.suggested_opening_prompt;
}

export function getMockTranscript({
  scenario,
  turnNumber,
}: {
  scenario: RoleplayScenario;
  turnNumber: number;
}) {
  if (scenario.key === "uk-job-interview") {
    return turnNumber <= 1
      ? "Thank you for inviting me. I am interested in this role because it matches my communication and problem-solving experience."
      : "One example is when I helped a team improve a process and explain the next step clearly.";
  }

  if (scenario.key === "asking-for-clarification") {
    return "Could you clarify the deadline and the next action for me, please?";
  }

  if (scenario.key === "professional-phone-call") {
    return "Good morning, I am calling to confirm the appointment time and reference number.";
  }

  return scenario.example_phrases[0] ?? "I would like to explain that clearly.";
}

export function createMockAssistantReply({
  scenario,
  userText,
  assistantTurnCount,
}: {
  scenario: RoleplayScenario;
  userText: string;
  assistantTurnCount: number;
}) {
  if (assistantTurnCount >= scenario.turns - 1) {
    return "Thank you. That gives us enough to review your speaking practice. You can end the session when you are ready for feedback.";
  }

  if (scenario.key === "uk-job-interview") {
    return userText.toLowerCase().includes("example")
      ? "That is useful. Could you now explain the result and what you learned from that situation?"
      : "Thank you. Could you give me one specific example that shows how you handled a challenge at work?";
  }

  if (scenario.key === "introducing-yourself-at-work") {
    return "That is a clear introduction. What kind of work are you most looking forward to doing with the team?";
  }

  if (scenario.key === "asking-for-clarification") {
    return "Of course. The deadline is Friday afternoon, and the next action is to send a short update. Could you repeat that back to check it is clear?";
  }

  if (scenario.key === "customer-service-conversation") {
    return "Thank you. I appreciate that. Could you explain what will happen next and when I should expect an update?";
  }

  return "Thanks, that is helpful. Could you confirm the key detail once more before we finish the call?";
}

export function createMockRoleplayFeedback({
  scenario,
  messages,
}: {
  scenario: RoleplayScenario;
  messages: RoleplayMessage[];
}): RoleplayFeedback {
  const userTurns = messages.filter((message) => message.sender === "user");
  const recommendedLesson =
    recommendedLessonsByScenario[scenario.key] ??
    recommendedLessonsByScenario["uk-job-interview"];

  return {
    overall_summary:
      userTurns.length > 1
        ? "You kept the conversation moving and gave the assistant enough information to respond naturally."
        : "You made a clear start. A few more turns will give a fuller picture of your speaking patterns.",
    clarity_score: 80,
    confidence_score: 76,
    structure_score: 78,
    pronunciation_rhythm_observation:
      "Your rhythm is easiest to follow when you pause briefly before key workplace details.",
    what_went_well:
      "Your speech came across clearly when you used short, direct phrases.",
    one_thing_to_improve:
      "One useful focus for next time is slowing slightly before important names, dates, or examples.",
    suggested_phrases: scenario.example_phrases.slice(0, 3),
    recommended_next_lesson: recommendedLesson,
    recommended_next_roleplay:
      scenario.key === "uk-job-interview"
        ? "Introducing yourself at work"
        : "UK job interview",
    encouragement:
      "This feedback is guidance, not judgement. Keep practising short turns and your confidence will build naturally.",
    is_mock: true,
  };
}
