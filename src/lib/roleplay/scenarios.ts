import type { RoleplayScenario } from "@/lib/types";

export const roleplayScenarios: RoleplayScenario[] = [
  {
    key: "uk-job-interview",
    title: "UK job interview",
    description:
      "Practise calm, structured answers with a supportive UK interviewer.",
    user_goal:
      "Answer common interview questions with clear structure, steady pace, and confident delivery.",
    ai_role: "A calm UK interviewer for a professional role.",
    difficulty: "intermediate",
    suggested_opening_prompt:
      "Thanks for joining today. Could you start by telling me a little about yourself and why this role interests you?",
    focus_skills: ["structured answers", "clarity", "pace", "confidence"],
    example_phrases: [
      "One example is when...",
      "The result was...",
      "What I learned from that was...",
    ],
    success_criteria: [
      "Answer uses a clear beginning, example, and result.",
      "Key points are paced calmly.",
      "The user sounds prepared without memorising every word.",
    ],
    context: "Interview",
    turns: 8,
  },
  {
    key: "introducing-yourself-at-work",
    title: "Introducing yourself at work",
    description:
      "Practise first-day introductions and light professional small talk.",
    user_goal:
      "Introduce yourself naturally, explain your role, and respond to friendly follow-up questions.",
    ai_role: "A welcoming UK colleague or line manager.",
    difficulty: "beginner",
    suggested_opening_prompt:
      "Welcome to the team. It is lovely to meet you. Would you like to introduce yourself?",
    focus_skills: ["introductions", "small talk", "sentence stress"],
    example_phrases: [
      "I am joining the team as...",
      "I previously worked on...",
      "I am looking forward to...",
    ],
    success_criteria: [
      "Introduction includes name, role, and one helpful detail.",
      "Speech has comfortable pauses.",
      "The user responds politely to a follow-up question.",
    ],
    context: "Workplace",
    turns: 6,
  },
  {
    key: "asking-for-clarification",
    title: "Asking for clarification in a meeting",
    description:
      "Practise asking someone to repeat, explain, or slow down professionally.",
    user_goal:
      "Ask for clarification confidently and politely during a fast UK workplace conversation.",
    ai_role: "A meeting participant explaining a project update.",
    difficulty: "beginner",
    suggested_opening_prompt:
      "I have just shared the next project milestone quite quickly. What would you like me to clarify?",
    focus_skills: ["polite clarification", "intonation", "confidence"],
    example_phrases: [
      "Could you clarify that last point?",
      "Would you mind repeating the deadline?",
      "Can I check I understood correctly?",
    ],
    success_criteria: [
      "Clarification request is specific.",
      "Tone sounds polite and confident.",
      "The user confirms the key detail afterwards.",
    ],
    context: "Meeting",
    turns: 6,
  },
  {
    key: "customer-service-conversation",
    title: "Handling a customer service conversation",
    description:
      "Practise calm, clear wording with a customer who has a simple issue.",
    user_goal:
      "Acknowledge the customer, explain next steps, and keep the conversation steady.",
    ai_role: "A UK customer with a straightforward service problem.",
    difficulty: "intermediate",
    suggested_opening_prompt:
      "Hello, I am calling because I have not received an update about my appointment. Can you help?",
    focus_skills: ["empathy", "clear explanation", "pace", "professional tone"],
    example_phrases: [
      "Thank you for explaining that.",
      "I will check that for you now.",
      "The next step is...",
    ],
    success_criteria: [
      "Customer concern is acknowledged.",
      "Next step is explained clearly.",
      "Speech remains calm and easy to follow.",
    ],
    context: "Service",
    turns: 8,
  },
  {
    key: "professional-phone-call",
    title: "Making a professional phone call",
    description:
      "Practise opening, explaining the reason, checking details, and closing politely.",
    user_goal:
      "Speak clearly on the phone when there are no visual cues and confirm important details.",
    ai_role: "A receptionist, colleague, or customer on a UK phone call.",
    difficulty: "intermediate",
    suggested_opening_prompt:
      "Good morning. You are through to the office. How can I help today?",
    focus_skills: ["phone clarity", "confirmation", "pace", "closing"],
    example_phrases: [
      "I am calling to confirm...",
      "Could I check the reference number?",
      "Thanks for your help today.",
    ],
    success_criteria: [
      "Call purpose is clear in the opening.",
      "Important details are confirmed.",
      "The conversation closes politely.",
    ],
    context: "Phone",
    turns: 6,
  },
];

export function getRoleplayScenario(key: string) {
  return roleplayScenarios.find((scenario) => scenario.key === key) ?? null;
}
