import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  console.log(
    "Middleware: Path:",
    request.nextUrl.pathname,
    "Token:",
    token ? "exists" : "not found"
  );

  // Erlaubte Routen ohne Token
  const publicRoutes = ["/login", "/api/login"];
  if (publicRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    console.log("Middleware: No token, redirecting to /login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/login|_next/static|_next/image|favicon.ico).*)"],
};
