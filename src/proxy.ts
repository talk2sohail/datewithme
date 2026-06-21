import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/auth";

const publicPaths = ["/", "/login", "/signup"];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublic =
    publicPaths.includes(path) || path.startsWith("/api/auth/");

  const cookie = request.cookies.get("session")?.value;
  const session = await decrypt(cookie);

  if (!isPublic && !session?.userId) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|uploads|.*\\.(?:png|jpg|jpeg|svg|gif|webp)$).*)",
  ],
};
