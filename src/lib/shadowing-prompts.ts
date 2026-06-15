export type ShadowingPrompt = {
  key: string;
  category: string;
  title: string;
  description: string;
  text: string;
  focus: string;
};

export const shadowingPrompts: ShadowingPrompt[] = [
  {
    key: "workplace-introduction",
    category: "Workplace introductions",
    title: "Introduce yourself clearly",
    description: "Practise a warm first-day introduction with clear pauses.",
    text: "Hello, I am pleased to meet you. I am joining the team as a project coordinator.",
    focus: "sentence stress",
  },
  {
    key: "asking-for-clarification",
    category: "Asking for clarification",
    title: "Clarify a meeting point",
    description: "Use polite intonation while keeping the request direct.",
    text: "Could you clarify the next step for me before we finish the meeting?",
    focus: "intonation",
  },
  {
    key: "interview-answer",
    category: "Interview answers",
    title: "Structured interview answer",
    description: "Practise a short answer with calm rhythm and clear stress.",
    text: "One example is when I helped improve a team process and agreed the next action.",
    focus: "word stress",
  },
  {
    key: "phone-call-clarity",
    category: "Phone call clarity",
    title: "Confirm details on a call",
    description: "Keep key details audible when there is no visual context.",
    text: "I am calling to confirm the appointment time and check the reference number.",
    focus: "clarity",
  },
  {
    key: "customer-facing-conversation",
    category: "Customer-facing conversation",
    title: "Acknowledge and reassure",
    description: "Sound calm, helpful, and easy to follow in a service moment.",
    text: "Thank you for explaining the issue. I will check that now and update you shortly.",
    focus: "pace",
  },
  {
    key: "meeting-contribution",
    category: "Meeting contribution",
    title: "Contribute an idea",
    description: "Use sentence stress to make your main point stand out.",
    text: "I have one suggestion that could make the process simpler for the team.",
    focus: "sentence stress",
  },
];
