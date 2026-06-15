import { PageHeader } from "@/components/app/page-header";
import { ShadowingPracticeCard } from "@/components/shadowing/shadowing-practice-card";

export default function ShadowingPage() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Shadowing"
        title="Listen, repeat, compare, and refine."
        description="Practise natural British rhythm and intonation through short workplace phrases, while keeping your own voice and identity."
      />

      <ShadowingPracticeCard />
    </section>
  );
}
