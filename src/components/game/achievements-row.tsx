import { AchievementBadge } from "@/components/game/achievement-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Achievement } from "@/lib/gamification";

export function AchievementsRow({
  achievements,
  earnedCount,
}: {
  achievements: Achievement[];
  earnedCount: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
        <CardDescription>
          {earnedCount} of {achievements.length} unlocked — keep practising to
          earn the rest.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {achievements.map((achievement) => (
            <AchievementBadge key={achievement.key} achievement={achievement} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
