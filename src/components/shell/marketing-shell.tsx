import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { marketingRoutes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link className="font-semibold tracking-normal" href="/">
            {siteConfig.name}
          </Link>
          <nav className="hidden items-center gap-5 text-sm text-muted-foreground sm:flex">
            {marketingRoutes.map((route) => (
              <Link
                className="hover:text-foreground"
                href={route.href}
                key={route.href}
              >
                {route.label}
              </Link>
            ))}
          </nav>
          <Link
            className={cn(buttonVariants({ size: "sm" }), "no-underline")}
            href="/auth/sign-up"
          >
            Start diagnostic
          </Link>
        </div>
      </header>
      <main>{children}</main>
      <footer className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:px-6 lg:px-8">
        <Separator />
        <p>Built for clarity, confidence, and UK professional communication.</p>
      </footer>
    </div>
  );
}
