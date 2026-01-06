import { NextRequest, NextResponse } from "next/server";
import { verificaSessao } from "./lib/sessao";

const publicRoutes = ["/auth/login", "/"];
const authenticatedRoutes = ["/dashboard"];

const pathPermissoes = {
  "editar_base_dados":["/api/base-dados", "/base-dados", "/api/cliente"],
  "editar_integracoes":["/api/integracoes", "/integracoes"],
  "visualizar_relatorios":["/api/relatorios", "/relatorios"],
  "editar_campanhas":["/api/campanhas", "/campanhas"],
  "admin":["/api/usuarios", "/usuarios"]
}

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (publicRoutes.includes(path) || req.headers.get("next-action")) {
    return NextResponse.next();
  }

  try {
    const sessao = await verificaSessao();
    if (authenticatedRoutes.some(p => path.startsWith(p))) {
      return NextResponse.next();
    }

    const autorizado = temPermissaoParaPath(path, sessao.permissoes, sessao.admin);

    if (!autorizado) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}
function temPermissaoParaPath( path: string, permissoesUsuario: string[], admin: boolean): boolean {
  if (admin) return true;

  for (const permissao of permissoesUsuario) {
    const pathsPermitidos = pathPermissoes[permissao as keyof typeof pathPermissoes];
    if (!pathsPermitidos) continue;

    if (pathsPermitidos.some((p) => path.startsWith(p))) {
      return true;
    }
  }

  return false;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|_next/data|favicon.ico|.*\\..*).*)'],
};