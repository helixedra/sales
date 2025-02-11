// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  // Дозволити доступ до сторінки входу
  if (pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  // Якщо користувач не авторизований, перенаправити на сторінку входу
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Дозволити доступ до всіх інших маршрутів
  return NextResponse.next();
}

// Застосувати middleware до всіх маршрутів
export const config = {
  matcher: ["/((?!api/auth|login|_next/static|_next/image|favicon.ico).*)"],
};
