import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ComingSoonCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  phase: string;
  children?: React.ReactNode;
};

export function ComingSoonCard({
  icon: Icon,
  title,
  description,
  phase,
  children,
}: ComingSoonCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="grid size-10 place-items-center rounded-lg bg-muted text-muted-foreground">
            <Icon className="size-5" />
          </div>
          <Badge variant="outline">{phase}</Badge>
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {children ? <CardContent>{children}</CardContent> : null}
    </Card>
  );
}
