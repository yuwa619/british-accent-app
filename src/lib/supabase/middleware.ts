import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { isSupabaseConfigured, supabaseEnv } from "@/lib/supabase/env";

const protectedRoutePatterns = [
  /^\/dashboard(?:\/.*)?$/,
  /^\/diagnostic(?:\/.*)?$/,
  /^\/lessons(?:\/.*)?$/,
  /^\/practice(?:\/.*)?$/,
  /^\/feedback(?:\/.*)?$/,
  /^\/progress(?:\/.*)?$/,
  /^\/settings(?:\/.*)?$/,
];

const authRoutes = new Set(["/auth/sign-in", "/auth/sign-up"]);

function isProtectedPath(pathname: string) {
  return protectedRoutePatterns.some((pattern) => pattern.test(pathname));
}

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!isSupabaseConfigured()) {
    return NextResponse.next({
      request,
    });
  }

  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    supabaseEnv.url as string,
    supabaseEnv.anonKey as string,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && isProtectedPath(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/auth/sign-in";
    redirectUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(redirectUrl);
  }

  if (user && authRoutes.has(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    redirectUrl.search = "";

    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
