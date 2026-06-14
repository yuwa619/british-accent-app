import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ recordingId: string }> }
) {
  const { recordingId } = await params;

  if (!recordingId) {
    return NextResponse.json(
      { error: "Missing recording id." },
      { status: 400 }
    );
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: true, mode: "mock" });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Sign in to delete recordings." },
      { status: 401 }
    );
  }

  const { data: recording, error: loadError } = await supabase
    .from("recordings")
    .select("*")
    .eq("id", recordingId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (loadError) {
    return NextResponse.json(
      { error: "Unable to load recording." },
      { status: 500 }
    );
  }

  if (!recording) {
    return NextResponse.json(
      { error: "Recording not found." },
      { status: 404 }
    );
  }

  if (recording.storage_path) {
    const { error: storageError } = await supabase.storage
      .from("recordings")
      .remove([recording.storage_path]);

    if (storageError) {
      return NextResponse.json(
        { error: "Unable to delete stored audio. Please try again." },
        { status: 500 }
      );
    }
  }

  const { error: deleteError } = await supabase
    .from("recordings")
    .delete()
    .eq("id", recording.id)
    .eq("user_id", user.id);

  if (deleteError) {
    return NextResponse.json(
      { error: "Unable to delete recording metadata." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, mode: "supabase" });
}
