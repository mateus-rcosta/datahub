"use server";

import { AuthPayload, JSONBSessaoDados } from "@/types/types";
import { SignJWT, decodeJwt, jwtVerify } from "jose";
import { cookies, headers } from "next/headers";
import { prisma } from "./database";
import { Prisma } from "@prisma/client";
import { JWSSignatureVerificationFailed, JWTExpired } from "jose/errors";
import { SessaoError, SessaoErrorType } from "./sessao-error";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "supersecret");
const EXPIRE_TIME_HOURS = Number(process.env.EXPIRE_TIME ?? 8);
const COOKIE_NAME = "sessao_token";

export const criaSessao = async (payload: AuthPayload) => {
  const jti = crypto.randomUUID();
  const iat = new Date();
  const exp = new Date(iat.getTime() + EXPIRE_TIME_HOURS * 60 * 60 * 1000);

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .setJti(jti)
    .sign(JWT_SECRET);

  const h = await headers();

  const dadosDomain: JSONBSessaoDados = {
    ip: h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown",
    userAgent: h.get("user-agent") ?? "unknown",
  }

  const dadosPrisma = dadosDomain as unknown as Prisma.JsonObject;

  await prisma.sessao.create({
    data: {
      sid: jti,
      usuarioId: payload.usuarioId,
      createdAt: iat,
      expiredAt: exp,
      dados: dadosPrisma
    },
  });

  (await cookies()).set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

const descriptografaToken = async (token: string) => {
  try {
    return await jwtVerify(token, JWT_SECRET);
  } catch (error: unknown) {
    // Token expirado
    if (error instanceof JWTExpired) {
      throw new SessaoError(
        SessaoErrorType.TOKEN_EXPIRADO,
        "Token expirado."
      );
    }

    // Assinatura inválida
    if (error instanceof JWSSignatureVerificationFailed) {
      throw new SessaoError(
        SessaoErrorType.ASSINATURA_INVALIDA,
        "Assinatura inválida."
      );
    }

    // Outros erros do JWT
    if (error instanceof Error) {
      throw new SessaoError(
        SessaoErrorType.TOKEN_INVALIDO,
        `Token inválido: ${error.message}`
      );
    }

    throw new SessaoError(
      SessaoErrorType.TOKEN_INVALIDO,
      "Erro desconhecido ao verificar token."
    );
  }
}

// Validar sessão (retorna payload se válido)
export const verificaSessao = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      throw new SessaoError(
        SessaoErrorType.USUARIO_NAO_LOGADO,
        "Usuário não logado."
      );
    }

    const { payload } = await descriptografaToken(token);
    const authPayload = payload as AuthPayload;
    const sessaoValida = await prisma.sessao.findUnique({
      where: {
        revokedAt: null,
        sid: authPayload.jti
      },
      select: {
        id: true
      }
    }) !== null;

    if (sessaoValida) {
      return authPayload
    }

    throw new SessaoError(
      SessaoErrorType.TOKEN_INVALIDO,
      "Token inválido."
    );
  } catch (error: unknown) {
    if (error instanceof SessaoError) {
      throw error;
    }
    throw error;
  }
}



// Excluir sessão (apagar cookie)
export const deletaSessao = async () => {
  const cookieStore = cookies();
  const token = (await cookieStore).get(COOKIE_NAME)?.value;

  if (!token) return null;

  const { payload } = await jwtVerify(token, JWT_SECRET);

  const payloadAuth = payload as AuthPayload;
  await prisma.sessao.update({
    where: {
      sid: payloadAuth.jti,
      usuarioId: payloadAuth.usuarioId,
      revokedAt: null,
      expiredAt: { gt: new Date() }
    },
    data: {
      revokedAt: new Date()
    },
    select: {
      sid: true
    }
  });
  limpaTokenCookie();
}

export const limpaTokenCookie = async () => {
  (await cookies()).set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

export const retornaSessaoUsuario = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      throw new SessaoError(
        SessaoErrorType.USUARIO_NAO_LOGADO,
        "Usuário não logado."
      );
    }

    const { payload } = await descriptografaToken(token);
    return payload as AuthPayload;

  } catch (error) {
    return null
  }

}

export const retornaPayloadSemDescriptografar = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) {
      throw new SessaoError(
        SessaoErrorType.USUARIO_NAO_LOGADO,
        "Usuário não logado."
      );
    }

    const payload  = await decodeJwt(token);
    return payload as AuthPayload;

  } catch (error) {
    return null
  }

}