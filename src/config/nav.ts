import {
  ActivityIcon,
  GraduationCapIcon,
  HomeIcon,
  MessageSquareTextIcon,
  Mic2Icon,
  SparklesIcon,
  TrendingUpIcon,
  UserRoundIcon,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  /** Label shown in the desktop sidebar. */
  label: string;
  /** Shorter label for the mobile bottom navigation. */
  shortLabel?: string;
  icon: LucideIcon;
  /** Shown in the mobile bottom navigation when true. */
  primary?: boolean;
};

export const appNavItems: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: HomeIcon, primary: true },
  { href: "/diagnostic", label: "Diagnostic", icon: ActivityIcon },
  {
    href: "/lessons",
    label: "Lessons",
    icon: GraduationCapIcon,
    primary: true,
  },
  {
    href: "/practice/shadowing",
    label: "Practice",
    icon: Mic2Icon,
    primary: true,
  },
  {
    href: "/practice/roleplay",
    label: "Roleplay",
    icon: MessageSquareTextIcon,
  },
  {
    href: "/progress",
    label: "Progress",
    icon: TrendingUpIcon,
    primary: true,
  },
  {
    href: "/settings",
    label: "Settings",
    shortLabel: "Profile",
    icon: UserRoundIcon,
    primary: true,
  },
  { href: "/onboarding", label: "Onboarding", icon: SparklesIcon },
];

export const primaryNavItems = appNavItems.filter((item) => item.primary);

export function isNavItemActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
