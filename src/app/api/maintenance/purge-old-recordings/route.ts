import { NextResponse } from "next/server";

import { captureServerError } from "@/lib/monitoring/sentry";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const runtime = "nodejs";

type CandidateRecording = {
  id: string;
  user_id: string;
  storage_path: string;
  created_at: string;
};

function authorised(request: Request) {
  const configuredSecret = process.env.MAINTENANCE_SECRET;
  if (!configuredSecret) return false;

  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;
  const explicitHeader = request.headers.get("x-maintenance-secret");

  return (
    bearerToken === configuredSecret || explicitHeader === configuredSecret
  );
}

function daysBetween(now: number, date: string) {
  return (now - new Date(date).getTime()) / 86_400_000;
}

export async function POST(request: Request) {
  if (!authorised(request)) {
    return NextResponse.json(
      { error: "Maintenance secret is missing or invalid." },
      { status: 401 }
    );
  }

  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({
      success: true,
      mode: "mock",
      purgedCount: 0,
      message:
        "Supabase admin credentials are not configured. Retention purge ran as a safe no-op.",
    });
  }

  try {
    const admin = createAdminClient();
    const now = Date.now();
    const oldestPossibleRetention = new Date(now - 86_400_000).toISOString();

    const { data: candidates, error: recordingsError } = await admin
      .from("recordings")
      .select("id, user_id, storage_path, created_at")
      .lte("created_at", oldestPossibleRetention)
      .order("created_at", { ascending: true })
      .limit(500);

    if (recordingsError) {
      return NextResponse.json(
        { error: "Unable to load candidate recordings." },
        { status: 500 }
      );
    }

    const candidateRecordings = (candidates ?? []) as CandidateRecording[];
    const userIds = Array.from(
      new Set(candidateRecordings.map((recording) => recording.user_id))
    );
    const settingsByUser = new Map<string, number>();

    if (userIds.length) {
      const { data: settings, error: settingsError } = await admin
        .from("user_settings")
        .select("user_id, retain_recordings_days")
        .in("user_id", userIds);

      if (settingsError) {
        return NextResponse.json(
          { error: "Unable to load retention settings." },
          { status: 500 }
        );
      }

      settings?.forEach((setting) => {
        settingsByUser.set(
          setting.user_id,
          Math.max(setting.retain_recordings_days ?? 30, 1)
        );
      });
    }

    const staleRecordings = candidateRecordings.filter((recording) => {
      const retentionDays = settingsByUser.get(recording.user_id) ?? 30;
      return daysBetween(now, recording.created_at) >= retentionDays;
    });

    if (!staleRecordings.length) {
      return NextResponse.json({
        success: true,
        mode: "supabase",
        purgedCount: 0,
      });
    }

    const storagePaths = staleRecordings
      .map((recording) => recording.storage_path)
      .filter(Boolean);

    if (storagePaths.length) {
      const { error: storageError } = await admin.storage
        .from("recordings")
        .remove(storagePaths);

      if (storageError) {
        return NextResponse.json(
          { error: "Unable to purge old audio objects." },
          { status: 500 }
        );
      }
    }

    const { error: deleteError } = await admin
      .from("recordings")
      .delete()
      .in(
        "id",
        staleRecordings.map((recording) => recording.id)
      );

    if (deleteError) {
      return NextResponse.json(
        { error: "Unable to purge old recording rows." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      mode: "supabase",
      purgedCount: staleRecordings.length,
    });
  } catch (error) {
    await captureServerError(error, {
      route: "/api/maintenance/purge-old-recordings",
    });
    return NextResponse.json(
      { error: "Unable to run retention purge right now." },
      { status: 500 }
    );
  }
}
