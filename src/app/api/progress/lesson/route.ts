import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

type ProgressRequest = {
  lessonId?: string;
  status?: "not_started" | "in_progress" | "complete";
  lastScore?: number | null;
};

function safeError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const body = (await request
    .json()
    .catch(() => null)) as ProgressRequest | null;

  if (!body?.lessonId) {
    return safeError("Choose a lesson to update.");
  }

  const status = body.status ?? "in_progress";

  if (!["not_started", "in_progress", "complete"].includes(status)) {
    return safeError("Choose a valid lesson status.");
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      progress: {
        lesson_id: body.lessonId,
        status,
        last_score: body.lastScore ?? null,
      },
      mode: "mock",
    });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return safeError("Sign in to update progress.", 401);
  }

  const { data, error } = await supabase
    .from("user_progress")
    .upsert(
      {
        user_id: user.id,
        lesson_id: body.lessonId,
        status,
        completion_percent:
          status === "complete" ? 100 : status === "in_progress" ? 50 : 0,
        last_score: body.lastScore ?? null,
        completed_at: status === "complete" ? new Date().toISOString() : null,
      },
      { onConflict: "user_id,lesson_id" }
    )
    .select("*")
    .single();

  if (error) {
    return safeError("Unable to update lesson progress.", 500);
  }

  return NextResponse.json({ progress: data, mode: "supabase" });
}
