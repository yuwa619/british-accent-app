"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOutIcon } from "lucide-react";

import { signOutAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { appNavItems, isNavItemActive, primaryNavItems } from "@/config/nav";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

function BrandMark() {
  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-2 font-semibold tracking-tight no-underline"
    >
      <span className="grid size-8 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
        AC
      </span>
      <span className="text-sm leading-tight">{siteConfig.name}</span>
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/90 px-4 backdrop-blur md:hidden">
        <BrandMark />
        <form action={signOutAction}>
          <Button
            type="submit"
            variant="ghost"
            size="icon-sm"
            aria-label="Sign out"
          >
            <LogOutIcon />
          </Button>
        </form>
      </header>

      <div className="mx-auto grid w-full max-w-7xl md:grid-cols-[248px_1fr]">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen flex-col border-r bg-background px-3 py-5 md:flex">
          <div className="px-2">
            <BrandMark />
          </div>
          <nav className="mt-7 flex flex-1 flex-col gap-1">
            {appNavItems.map((item) => {
              const active = isNavItemActive(pathname, item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm no-underline transition-colors",
                    active
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <form action={signOutAction} className="px-1">
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="w-full"
            >
              <LogOutIcon data-icon="inline-start" />
              Sign out
            </Button>
          </form>
        </aside>

        {/* Content */}
        <main className="min-w-0 bg-background pb-24 md:bg-muted/20 md:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="mx-auto flex max-w-md items-stretch justify-around">
          {primaryNavItems.map((item) => {
            const active = isNavItemActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "tap-scale flex flex-col items-center gap-1 px-1 py-2 text-[0.65rem] font-medium no-underline transition-colors",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "grid h-8 w-12 place-items-center rounded-full transition-colors",
                      active && "bg-primary/12"
                    )}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  {item.shortLabel ?? item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
