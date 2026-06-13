import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SignUpPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-normal">
          Create account
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Account creation, profile setup, and onboarding redirects arrive in
          Phase 2.
        </p>
      </div>
      <Link
        className={cn(buttonVariants({ size: "lg" }), "w-full no-underline")}
        href="/onboarding"
      >
        Continue to onboarding
      </Link>
      <p className="text-center text-sm text-muted-foreground">
        Already registered?{" "}
        <Link className="font-medium text-foreground" href="/auth/sign-in">
          Sign in
        </Link>
      </p>
    </div>
  );
}
