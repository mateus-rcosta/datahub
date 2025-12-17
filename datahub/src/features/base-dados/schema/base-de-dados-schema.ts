import z from "zod";

const TIPOS_PERMITIDOS = ['text/csv', 'application/vnd.ms-excel', 'text/comma-separated-values', 'application/csv'];

export const baseDeDadosSchema = z.object({
  nome: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),

  estrutura: z
    .array(z.string().min(1))
    .min(1, "O CSV precisa ter pelo menos uma coluna")
    // .transform((cols) => cols.map(c => c.trim().toLowerCase()))
    // .refine(
    //   (cols) => cols.some(c => ["telefone", "whatsapp", "email"].includes(c)),
    //   "O CSV precisa conter telefone, whatsapp ou email"
    // ),
    ,
  arquivo: z
    .file({ message: "Arquivo obrigatório" }).mime(TIPOS_PERMITIDOS, "O arquivo precisa ser CSV.")
});
