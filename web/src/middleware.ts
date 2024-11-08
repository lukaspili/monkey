import type { NextRequest } from "next/server";

const guestPaths = ["/sign-in", "/sign-up", "/password"];

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const validSession = accessToken ? true : false;
  const isGuestPath = guestPaths.some((path) => request.nextUrl.pathname.startsWith(path));

  if (!validSession && !isGuestPath) {
    return Response.redirect(new URL("/sign-in", request.url));
  }

  if (validSession && isGuestPath) {
    return Response.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",

    // /*
    //  * Match all request paths except guest ones:
    //  * - /sign-in
    //  * - /sign-up
    //  */
    // "/((?!sign-in|sign-up).*)",
  ],
};
