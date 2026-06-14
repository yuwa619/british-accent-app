import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type ProgressCardProps = {
  title: string;
  description: string;
  value: number;
  footer?: string;
};

export function ProgressCard({
  title,
  description,
  value,
  footer,
}: ProgressCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Progress value={value} />
        {footer ? (
          <p className="text-sm text-muted-foreground">{footer}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
