"use server";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "supersecret");
const COOKIE_NAME = "session_token";
const EXPIRES_IN = "8h";

export interface SessionPayload {
    [key: string]: any;
    userId: number;
    email: string;
    admin: boolean;
    editar_campanhas:boolean;
    editar_base_dados:boolean;
    editar_integracoes:boolean;
    visualizar_relatorios:boolean;
}

// Criar sessão (gerar JWT e armazenar no cookie)
export async function createSession(payload: SessionPayload) {
    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setIssuedAt()
        .setExpirationTime(EXPIRES_IN)
        .sign(JWT_SECRET);

    (await cookies()).set({
        name: COOKIE_NAME,
        value: token,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    return token;
}

// Validar sessão (retorna payload se válido)
export async function verifySession() {
    const cookieStore = cookies();
    const token = (await cookieStore).get(COOKIE_NAME)?.value;

    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as SessionPayload;
    } catch (e) {
        return null;
    }
}

export async function decrypt(token: string | undefined) {
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as SessionPayload;
    } catch (e) {
        return null;
    }
}

// Atualizar sessão (pode regenerar JWT com dados novos)
export async function updateSession(payload: SessionPayload) {
    return createSession(payload);
}

// Excluir sessão (apagar cookie)
export async function deleteSession() {
    (await cookies()).set({
        name: COOKIE_NAME,
        value: "",
        path: "/",
        expires: new Date(0),
    });
}


