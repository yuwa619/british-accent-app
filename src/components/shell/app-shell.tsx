import Link from "next/link";

import { signOutAction } from "@/app/auth/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { appRoutes } from "@/config/routes";
import { siteConfig } from "@/config/site";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/25">
      <div className="mx-auto grid min-h-screen min-w-0 max-w-7xl md:grid-cols-[240px_1fr]">
        <aside className="min-w-0 border-b bg-background px-4 py-4 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between gap-3 md:flex-col md:items-start">
            <Link className="font-semibold tracking-normal" href="/dashboard">
              {siteConfig.name}
            </Link>
            <Badge variant="outline">MVP</Badge>
          </div>
          <nav className="mt-6 flex min-w-0 gap-2 overflow-x-auto text-sm md:flex-col md:overflow-visible">
            {appRoutes.map((route) => (
              <Link
                className="shrink-0 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                href={route.href}
                key={route.href}
              >
                {route.label}
              </Link>
            ))}
          </nav>
          <form action={signOutAction} className="mt-6 hidden md:block">
            <Button size="sm" type="submit" variant="outline">
              Sign out
            </Button>
          </form>
        </aside>
        <main className="min-w-0 bg-background md:bg-muted/25">{children}</main>
      </div>
    </div>
  );
}
