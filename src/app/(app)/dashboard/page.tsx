import { RoutePlaceholder } from "@/components/shell/route-placeholder";

export default function DashboardPage() {
  return (
    <RoutePlaceholder
      title="Dashboard"
      description="A calm home base for the daily plan, diagnostic baseline, focus areas, and progress highlights."
      phase="Phase 3"
      primaryHref="/lessons"
      primaryLabel="Browse lessons"
      items={[
        "Daily practice path",
        "Top focus areas",
        "Recent feedback",
        "Progress overview",
      ]}
    />
  );
}
