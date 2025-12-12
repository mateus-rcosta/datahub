import { NextRequest, NextResponse } from "next/server";
import { verificaSessao } from "./lib/sessao";
import { SessaoError } from "./lib/sessao-error";

const publicRoutes = ["/auth/login", "/"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);

  if (isPublicRoute || req.headers.get("next-action")) {
    return NextResponse.next();
  }

  try {
    await verificaSessao();
    return NextResponse.next();
  } catch (error: unknown) {
    if (error instanceof SessaoError) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|_next/data|favicon.ico|.*\\..*).*)'],
};