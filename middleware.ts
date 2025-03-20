import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Removed 'path' module import as it is not supported in the Edge runtime

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/uploads")) {
    return NextResponse.rewrite(new URL(pathname, req.url));
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Allow access to the login page
  if (pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  // If the user is not authenticated, redirect to the login page
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Allow access to all other routes
  return NextResponse.next();
}

// Apply middleware to all routes
export const config = {
  matcher: ["/((?!api/auth|login|_next/static|_next/image|favicon.ico).*)"],
};
