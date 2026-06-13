import Link from "next/link";

import { signUpAction } from "@/app/auth/actions";
import { AuthForm } from "@/components/auth/auth-form";

export default function SignUpPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-normal">
          Create account
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Create your account, then continue to a short onboarding
          questionnaire.
        </p>
      </div>
      <AuthForm action={signUpAction} mode="sign-up" />
      <p className="text-center text-sm text-muted-foreground">
        Already registered?{" "}
        <Link className="font-medium text-foreground" href="/auth/sign-in">
          Sign in
        </Link>
      </p>
    </div>
  );
}
