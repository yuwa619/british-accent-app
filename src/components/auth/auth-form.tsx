"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import type { AuthActionState } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type AuthFormProps = {
  mode: "sign-in" | "sign-up";
  action: (
    state: AuthActionState,
    formData: FormData
  ) => Promise<AuthActionState>;
};

const initialState: AuthActionState = {};

function SubmitButton({ mode }: { mode: AuthFormProps["mode"] }) {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" disabled={pending} size="lg" type="submit">
      {pending
        ? mode === "sign-in"
          ? "Signing in..."
          : "Creating account..."
        : mode === "sign-in"
          ? "Sign in"
          : "Create account"}
    </Button>
  );
}

export function AuthForm({ mode, action }: AuthFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  const isSignUp = mode === "sign-up";

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <FieldGroup>
        {isSignUp ? (
          <Field>
            <FieldLabel htmlFor="fullName">Full name</FieldLabel>
            <Input
              autoComplete="name"
              id="fullName"
              name="fullName"
              placeholder="Your name"
            />
          </Field>
        ) : null}

        <Field data-invalid={Boolean(state.message)}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            aria-invalid={Boolean(state.message)}
            autoComplete="email"
            id="email"
            name="email"
            placeholder="you@example.com"
            required
            type="email"
          />
        </Field>

        <Field data-invalid={Boolean(state.message)}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            aria-invalid={Boolean(state.message)}
            autoComplete={isSignUp ? "new-password" : "current-password"}
            id="password"
            minLength={8}
            name="password"
            required
            type="password"
          />
          <FieldDescription>
            Use at least 8 characters. Keep this unique to your account.
          </FieldDescription>
          <FieldError>{state.message}</FieldError>
        </Field>
      </FieldGroup>

      <SubmitButton mode={mode} />
    </form>
  );
}
