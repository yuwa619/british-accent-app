export type AppRoute = {
  href: string;
  label: string;
  status: "foundation" | "phase-2" | "phase-3" | "later";
  description: string;
};

export const marketingRoutes: AppRoute[] = [
  {
    href: "/",
    label: "Home",
    status: "foundation",
    description: "Landing page for the MVP positioning and sign-up CTA.",
  },
  {
    href: "/privacy",
    label: "Privacy",
    status: "foundation",
    description: "Privacy, recording consent, and AI processing disclosure.",
  },
  {
    href: "/terms",
    label: "Terms",
    status: "foundation",
    description: "Plain-English product terms for beta users.",
  },
];

export const authRoutes: AppRoute[] = [
  {
    href: "/auth/sign-in",
    label: "Sign in",
    status: "phase-2",
    description: "Supabase-backed sign-in page.",
  },
  {
    href: "/auth/sign-up",
    label: "Sign up",
    status: "phase-2",
    description: "Account creation and profile setup entry point.",
  },
];

export const appRoutes: AppRoute[] = [
  {
    href: "/onboarding",
    label: "Onboarding",
    status: "phase-3",
    description: "Goal, language background, and professional context setup.",
  },
  {
    href: "/dashboard",
    label: "Dashboard",
    status: "phase-3",
    description: "Daily plan, progress, focus areas, and next best practice.",
  },
  {
    href: "/diagnostic",
    label: "Diagnostic",
    status: "later",
    description: "Three-step baseline speaking assessment.",
  },
  {
    href: "/lessons",
    label: "Lessons",
    status: "phase-3",
    description: "Structured British pronunciation and rhythm curriculum.",
  },
  {
    href: "/practice/shadowing",
    label: "Shadowing",
    status: "later",
    description: "Listen, repeat, compare, and refine practice.",
  },
  {
    href: "/practice/roleplay",
    label: "Roleplay",
    status: "later",
    description: "Turn-based UK workplace speaking scenarios.",
  },
  {
    href: "/progress",
    label: "Progress",
    status: "later",
    description: "Score trends, history, streaks, and focus area changes.",
  },
  {
    href: "/settings",
    label: "Settings",
    status: "later",
    description: "Account, privacy, data deletion, and subscription controls.",
  },
];

export const allRoutes = [...marketingRoutes, ...authRoutes, ...appRoutes];
