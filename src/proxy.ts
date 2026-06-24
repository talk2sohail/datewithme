import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/auth";
import { logInfo } from "@/lib/logger";

const publicPaths = ["/", "/login", "/signup"];
const couplePaths = ["/couple/create", "/couple/join"];

export async function proxy(request: NextRequest) {
  const start = performance.now();
  const path = request.nextUrl.pathname;
  const method = request.method;
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

  const isPublic = publicPaths.includes(path) || path.startsWith("/api/auth/");
  const isCouplePath = couplePaths.includes(path);

  const cookie = request.cookies.get("session")?.value;
  const session = await decrypt(cookie);

  let action: string;
  let status: number;

  if (session?.userId) {
    if (!session.coupleId && !isPublic && !isCouplePath) {
      action = "redirect /couple/create (no couple)";
      status = 302;
    } else if (isCouplePath && session.coupleId) {
      action = `redirect /history (already in couple)`;
      status = 302;
    } else {
      action = "pass";
      status = 200;
    }
  } else if (!isPublic) {
    action = `redirect /login (unauthenticated)`;
    status = 302;
  } else {
    action = "pass (public)";
    status = 200;
  }

  const duration = Math.round(performance.now() - start);
  logInfo("request", `${method} ${path} → ${status} (${action})`, {
    method,
    path,
    status,
    duration,
    ip,
    userId: session?.userId,
    username: session?.username,
    coupleId: session?.coupleId,
    action,
  });

  if (session?.userId) {
    if (!session.coupleId && !isPublic && !isCouplePath) {
      return NextResponse.redirect(new URL("/couple/create", request.url));
    }
    if (isCouplePath && session.coupleId) {
      return NextResponse.redirect(new URL("/history", request.url));
    }
    return NextResponse.next();
  }

  if (!isPublic) {
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
