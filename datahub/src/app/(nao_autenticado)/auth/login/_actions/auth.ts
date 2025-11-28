"use server";
import bcrypt from "bcrypt";
import { createSession } from "@/lib/session";
import { prisma } from "@/lib/database";
import { z } from "zod";
import { AuthError, AuthErrorType } from "@/app/(nao_autenticado)/_exception/AuthError";

const PermissoesSchema = z.object({
  editar_base_dados: z.boolean().optional().default(false),
  visualizar_relatorios: z.boolean().optional().default(false),
  editar_campanhas: z.boolean().optional().default(false),
  editar_integracoes: z.boolean().optional().default(false),
});

type LoginResult = 
  | { success: true }
  | { success: false; error: AuthErrorType };

export async function loginAction(
  email: string, 
  senha: string
): Promise<LoginResult> {
  try {
    const user = await prisma.funcionario.findUnique({ 
      where: { 
        email, 
        ativo: true, 
        deletedAt: null 
      } 
    });
    
    if (!user) {
      return { 
        success: false, 
        error: AuthErrorType.CREDENCIAIS_INVALIDAS 
      };
    }
    
    const valid = await bcrypt.compare(senha, user.senha);
    
    if (!valid) {
      return { 
        success: false, 
        error: AuthErrorType.CREDENCIAIS_INVALIDAS 
      };
    }
    
    const permissoes = PermissoesSchema.parse(user.permissoes);
    
    await createSession({
      userId: user.id,
      email: user.email,
      admin: user.admin,
      editar_campanhas: permissoes.editar_campanhas,
      editar_base_dados: permissoes.editar_base_dados,
      editar_integracoes: permissoes.editar_integracoes,
      visualizar_relatorios: permissoes.visualizar_relatorios,
    });
    
    return { success: true };
    
  } catch (error: unknown) {
    console.error("Erro no loginAction:", error);
    
    if (error instanceof AuthError) {
      return { 
        success: false, 
        error: error.code 
      };
    }
    
    return { 
      success: false, 
      error: AuthErrorType.ERRO_INTERNO 
    };
  }
}