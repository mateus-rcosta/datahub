import z from "zod";

export const usuarioSchema = z.object({
  nome: z.string().min(3, { message: "O nome deve ter no mínimo 3 caracteres" }),
  email: z.email({ message: "Digite um e-mail válido" }),
  senha: z
    .string()
    .min(8, { message: "A senha deve ter no mínimo 8 caracteres" })
    .max(50, { message: "A senha deve ter no máximo 50 caracteres" })
    .regex(/[A-Z]/, { message: "A senha deve conter ao menos uma letra maiúscula" })
    .regex(/[a-z]/, { message: "A senha deve conter ao menos uma letra minúscula" })
    .regex(/[0-9]/, { message: "A senha deve conter ao menos um número" }),
  admin: z.boolean(),
  permissoes: z.object({
    editar_base_dados: z.boolean(),
    visualizar_relatorios: z.boolean(),
    editar_campanhas: z.boolean(),
    editar_integracoes: z.boolean(),
  }),
  id: z.uuidv4("UUID inválido").nonempty("ID do usuário obrigatório").optional(),
});


export const editarSchema = usuarioSchema
  .pick({
    nome: true,
    email: true,
    admin: true,
    permissoes: true,
  })
  .extend({
    senha: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 8, { message: "A senha deve ter no mínimo 8 caracteres" })
      .refine((val) => !val || val.length <= 51, { message: "A senha deve ter no máximo 50 caracteres" })
      .refine((val) => !val || /[A-Z]/.test(val), { message: "A senha deve conter ao menos uma letra maiúscula" })
      .refine((val) => !val || /[a-z]/.test(val), { message: "A senha deve conter ao menos uma letra minúscula" })
      .refine((val) => !val || /[0-9]/.test(val), { message: "A senha deve conter ao menos um número" }),
    id: z.uuidv4("UUID inválido").nonempty("ID do usuário obrigatório")
  });

  export const uuidSchema = z.object({
    id: z.uuidv4("UUID inválido").nonempty("ID do usuário obrigatório"),
  })