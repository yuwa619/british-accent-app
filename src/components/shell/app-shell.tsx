import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { appRoutes } from "@/config/routes";
import { siteConfig } from "@/config/site";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/25">
      <div className="mx-auto grid min-h-screen max-w-7xl md:grid-cols-[240px_1fr]">
        <aside className="border-b bg-background px-4 py-4 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between gap-3 md:flex-col md:items-start">
            <Link className="font-semibold tracking-normal" href="/dashboard">
              {siteConfig.name}
            </Link>
            <Badge variant="outline">MVP</Badge>
          </div>
          <nav className="mt-6 flex gap-2 overflow-x-auto text-sm md:flex-col md:overflow-visible">
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
        </aside>
        <main className="bg-background md:bg-muted/25">{children}</main>
      </div>
    </div>
  );
}
