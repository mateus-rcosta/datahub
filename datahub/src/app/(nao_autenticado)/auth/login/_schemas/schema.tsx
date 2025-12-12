import z from "zod";

export const formSchema = z.object({
    email: z.email({message: "Digite um e-mail válido"}).min(1, { message: "E-mail é obrigatório" }),
    senha: z.string(),
});

export const PermissoesSchema = z.object({
  editar_base_dados: z.boolean().optional().default(false),
  visualizar_relatorios: z.boolean().optional().default(false),
  editar_campanhas: z.boolean().optional().default(false),
  editar_integracoes: z.boolean().optional().default(false),
});
