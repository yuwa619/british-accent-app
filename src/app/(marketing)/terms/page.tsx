import { RoutePlaceholder } from "@/components/shell/route-placeholder";

export default function TermsPage() {
  return (
    <RoutePlaceholder
      title="Terms"
      description="Beta product terms will sit here with clear guidance on coaching scores, subscriptions, and responsible use."
      phase="Phase 9"
      primaryHref="/auth/sign-up"
      primaryLabel="Create account"
      items={[
        "Scores are coaching guidance, not a judgement of accent or identity",
        "Subscription-ready structure with live charging disabled by default",
        "Acceptable use for workplace and learning practice",
      ]}
    />
  );
}
