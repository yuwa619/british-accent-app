import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between",
        className
      )}
    >
      <div className="flex max-w-3xl flex-col gap-3">
        {eyebrow ? (
          <Badge className="w-fit" variant="secondary">
            {eyebrow}
          </Badge>
        ) : null}
        <h1 className="text-3xl font-semibold tracking-normal text-balance sm:text-5xl">
          {title}
        </h1>
        <p className="text-base leading-7 text-muted-foreground sm:text-lg">
          {description}
        </p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
