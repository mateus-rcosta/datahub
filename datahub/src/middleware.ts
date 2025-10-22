import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/session";

const protectedRoutes = [
  "/dashboard",
  "/relatorios",
  "/base-dados",
  "/campanhas",
  "/integracoes",
  "/usuarios",
];
const publicRoutes = ["/auth/login", "/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const token = req.cookies.get("session_token")?.value;
  const session = await decrypt(token);

  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (isPublicRoute && session?.userId && !path.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
