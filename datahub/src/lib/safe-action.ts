import { createSafeActionClient } from "next-safe-action";
import { AuthError, AuthErrorType } from "@/app/(nao_autenticado)/_exception/AuthError";
import { UsuarioError } from "@/features/usuario/exceptions/usuario-error";
import { SessaoError, SessaoErrorType } from "./sessao-error";
import { retornaSessaoUsuario } from "./sessao";
import { ClienteError } from "@/features/cliente/exceptions/cliente-error";

export const actionClient = createSafeActionClient({
  handleServerError(e) {

    if (e instanceof AuthError || e instanceof UsuarioError || e instanceof SessaoError || e instanceof ClienteError) {
      return e.code;
    }

    return AuthErrorType.ERRO_INTERNO;
  },
});

export const authenticatedAction = actionClient.use(async ({ next }) => {
  try {
    const usuario = await retornaSessaoUsuario();
    if (!usuario)
      throw new SessaoError(SessaoErrorType.USUARIO_NAO_LOGADO, "Usuário não autenticado.");

    return next({
      ctx: {
        usuarioId: usuario.usuarioId,
        email: usuario.email,
        admin: usuario.admin,
        permissoes: usuario.permissoes,
      },
    });
  } catch (error) {
    throw new SessaoError(SessaoErrorType.USUARIO_NAO_LOGADO, "Usuário não autenticado.");
  }
});

