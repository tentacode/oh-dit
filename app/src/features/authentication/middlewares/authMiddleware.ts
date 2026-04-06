import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = [
  "/login",
  "/inscription",
  "/inscription/beta",
  "/mot-de-passe-oublie",
  "/reset-mot-de-passe",
  "/rapport-securise",
];

const NEED_LOGOUT_ROUTES = ["/inscription/beta"];

export function authMiddleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  // If the user is logged in and goes on a secured link
  // we don't redirect him.
  if (pathname.startsWith("/rapport-securise")) {
    return NextResponse.next();
  }

  if (PUBLIC_ROUTES.includes(pathname)) {
    // Some routes needs to be accessible even if I'm already logged in
    // in this case we force logout
    if (NEED_LOGOUT_ROUTES.includes(pathname) && token) {
      const response = NextResponse.next();
      response.cookies.set("auth_token", "", { path: "/", maxAge: 0 });
      return response;
    }

    // If I'm already logged in, I don't need to access to public route
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  // Other routes need to be authenticated
  // We redirect to login if the user is not authenticated
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
