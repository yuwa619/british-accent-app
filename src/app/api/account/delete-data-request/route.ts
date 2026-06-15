import { NextResponse } from "next/server";

import { captureServerError } from "@/lib/monitoring/sentry";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

type RequestBody = {
  notes?: string;
};

function normaliseNotes(notes: unknown) {
  if (typeof notes !== "string") return null;
  const trimmed = notes.trim();
  return trimmed ? trimmed.slice(0, 1000) : null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as RequestBody;
    const notes = normaliseNotes(body.notes);

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        request: {
          id: crypto.randomUUID(),
          user_id: "mock-user",
          email: null,
          request_type: "delete_all_data",
          status: "pending",
          notes,
          created_at: new Date().toISOString(),
          completed_at: null,
        },
        mode: "mock",
      });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Sign in to request data deletion." },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("data_deletion_requests")
      .insert({
        user_id: user.id,
        email: user.email ?? null,
        request_type: "delete_all_data",
        status: "pending",
        notes,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Unable to create the deletion request." },
        { status: 500 }
      );
    }

    return NextResponse.json({ request: data, mode: "supabase" });
  } catch (error) {
    await captureServerError(error, {
      route: "/api/account/delete-data-request",
    });
    return NextResponse.json(
      { error: "Unable to create the deletion request right now." },
      { status: 500 }
    );
  }
}
