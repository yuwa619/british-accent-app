import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SignInPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-normal">Sign in</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Supabase authentication will be connected in Phase 2.
        </p>
      </div>
      <Link
        className={cn(buttonVariants({ size: "lg" }), "w-full no-underline")}
        href="/dashboard"
      >
        Continue to dashboard
      </Link>
      <p className="text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link className="font-medium text-foreground" href="/auth/sign-up">
          Create an account
        </Link>
      </p>
    </div>
  );
}
