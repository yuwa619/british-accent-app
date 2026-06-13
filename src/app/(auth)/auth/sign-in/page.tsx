import Link from "next/link";

import { signInAction } from "@/app/auth/actions";
import { AuthForm } from "@/components/auth/auth-form";

export default function SignInPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-normal">Sign in</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Sign in with the email and password you used to create your account.
        </p>
      </div>
      <AuthForm action={signInAction} mode="sign-in" />
      <p className="text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link className="font-medium text-foreground" href="/auth/sign-up">
          Create an account
        </Link>
      </p>
    </div>
  );
}
