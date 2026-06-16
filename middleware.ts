import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const protectedRoutePatterns = [
  /^\/dashboard(?:\/.*)?$/,
  /^\/diagnostic(?:\/.*)?$/,
  /^\/lessons(?:\/.*)?$/,
  /^\/practice(?:\/.*)?$/,
  /^\/feedback(?:\/.*)?$/,
  /^\/progress(?:\/.*)?$/,
  /^\/settings(?:\/.*)?$/,
];

function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

function isProtectedPath(pathname: string) {
  return protectedRoutePatterns.some((pattern) => pattern.test(pathname));
}

function redirectToSignIn(request: NextRequest) {
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = "/auth/sign-in";
  redirectUrl.searchParams.set("next", request.nextUrl.pathname);

  return NextResponse.redirect(redirectUrl);
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next({
      request,
    });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.next({
      request,
    });
  }

  let response = NextResponse.next({
    request,
  });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
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

    if (!user) {
      return redirectToSignIn(request);
    }
  } catch {
    return redirectToSignIn(request);
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/diagnostic/:path*",
    "/lessons/:path*",
    "/practice/:path*",
    "/feedback/:path*",
    "/progress/:path*",
    "/settings/:path*",
  ],
};
