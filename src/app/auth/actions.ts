"use server";

import { redirect } from "next/navigation";

import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type AuthActionState = {
  message?: string;
};

export type OnboardingActionState = {
  message?: string;
  fieldErrors?: {
    nativeLanguage?: string;
    currentLevel?: string;
    primaryGoal?: string;
  };
};

const missingSupabaseMessage =
  "Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local to enable authentication.";

function readRequiredText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function validateCredentials(email: string, password: string) {
  if (!email || !email.includes("@")) {
    return "Enter a valid email address.";
  }

  if (!password || password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  return null;
}

export async function signInAction(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  if (!isSupabaseConfigured()) {
    return { message: missingSupabaseMessage };
  }

  const email = readRequiredText(formData, "email");
  const password = readRequiredText(formData, "password");
  const validationError = validateCredentials(email, password);

  if (validationError) {
    return { message: validationError };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { message: error.message };
  }

  redirect("/dashboard");
}

export async function signUpAction(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  if (!isSupabaseConfigured()) {
    return { message: missingSupabaseMessage };
  }

  const fullName = readRequiredText(formData, "fullName");
  const email = readRequiredText(formData, "email");
  const password = readRequiredText(formData, "password");
  const validationError = validateCredentials(email, password);

  if (validationError) {
    return { message: validationError };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || null,
      },
    },
  });

  if (error) {
    return { message: error.message };
  }

  redirect("/onboarding");
}

export async function signOutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  redirect("/auth/sign-in");
}

export async function saveOnboardingAction(
  _previousState: OnboardingActionState,
  formData: FormData
): Promise<OnboardingActionState> {
  if (!isSupabaseConfigured()) {
    redirect("/dashboard?setup=supabase-missing");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const nativeLanguage = readRequiredText(formData, "nativeLanguage");
  const currentLevel = readRequiredText(formData, "currentLevel");
  const primaryGoal = readRequiredText(formData, "primaryGoal");
  const profession = readRequiredText(formData, "profession");
  const currentChallenge = readRequiredText(formData, "currentChallenge");
  const speakingConfidenceRaw = readRequiredText(
    formData,
    "speakingConfidence"
  );
  const allowAiProcessing = formData.get("allowAiProcessing") === "yes";
  const targetSituations = formData
    .getAll("targetSituations")
    .filter((value): value is string => typeof value === "string");

  const fieldErrors: OnboardingActionState["fieldErrors"] = {};

  if (!nativeLanguage) {
    fieldErrors.nativeLanguage = "Add your native language or language family.";
  }

  if (!currentLevel) {
    fieldErrors.currentLevel = "Choose the statement that fits you best.";
  }

  if (!primaryGoal) {
    fieldErrors.primaryGoal = "Choose your main goal.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      fieldErrors,
      message: "Please complete the highlighted onboarding fields.",
    };
  }

  const { error: onboardingError } = await supabase
    .from("onboarding_responses")
    .insert({
      user_id: user.id,
      native_language: nativeLanguage || null,
      current_level: currentLevel || null,
      primary_goal: primaryGoal || null,
      profession: profession || null,
      speaking_confidence: Number(speakingConfidenceRaw) || null,
      target_situations: targetSituations.length ? targetSituations : null,
      current_challenge: currentChallenge || null,
      allow_ai_processing: allowAiProcessing,
    });

  if (onboardingError) {
    return { message: onboardingError.message };
  }

  const [{ error: profileError }, { error: settingsError }] = await Promise.all(
    [
      supabase
        .from("profiles")
        .update({
          native_language: nativeLanguage || null,
          target_goal: primaryGoal || null,
        })
        .eq("id", user.id),
      supabase
        .from("user_settings")
        .update({
          allow_ai_processing: allowAiProcessing,
        })
        .eq("user_id", user.id),
    ]
  );

  if (profileError || settingsError) {
    return {
      message:
        profileError?.message ??
        settingsError?.message ??
        "Your onboarding response was saved, but profile settings need another try.",
    };
  }

  redirect("/dashboard");
}
