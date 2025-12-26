import z from "zod";

const TIPOS_PERMITIDOS = ['text/csv', 'application/vnd.ms-excel', 'text/comma-separated-values', 'application/csv'];

export const baseDeDadosSchema = z.object({
  nome: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),

  estrutura: z
    .array(z.string().min(1))
    .min(1, "O CSV precisa ter pelo menos uma coluna"),
  arquivo: z
    .file({ message: "Arquivo obrigatório" }).mime(TIPOS_PERMITIDOS, "O arquivo precisa ser CSV.")
});

export const baseDadosVisualizacaoSchema = z.object({
  id: z.uuidv4("UUID inválido").nonempty("ID da base de dados obrigatório"),
  nome: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
})

export const baseDadosExcluiSchema = z.object({
  id: z.uuidv4("UUID inválido").nonempty("ID da base de dados obrigatório"),
})