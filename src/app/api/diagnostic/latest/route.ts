import { NextResponse } from "next/server";

import {
  getLatestDiagnosticReport,
  getMockDiagnosticReport,
} from "@/lib/data/diagnostic";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      diagnostic: getMockDiagnosticReport(),
      mode: "mock",
    });
  }

  const diagnostic = await getLatestDiagnosticReport();

  return NextResponse.json({
    diagnostic,
    mode: "supabase",
  });
}
