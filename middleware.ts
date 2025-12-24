import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "./src/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  if (request.nextUrl.pathname.startsWith("/admin")) {
    const hasSession =
      request.cookies.get("sb-access-token") ||
      request.cookies.get("sb-refresh-token");
    if (!hasSession) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
