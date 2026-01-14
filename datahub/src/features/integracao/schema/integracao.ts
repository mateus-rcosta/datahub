import z from "zod";

export const ixcSchema = z.object({
  url: z.url("URL válida é necessária"),
  login: z.string().min(1, "Login obrigatório"),
  senha: z.string().min(1, "Senha obrigatória"),
});

export const wifeedSchema = z.object({
  url: z.url("URL válida é necessária"),
  clientId: z.string().min(1, "clientId obrigatório"),
  clientSecret: z.string().min(1, "clientSecret obrigatório")
});

const templateSchema = z.object({
  id: z.coerce.number("ID é necessário ser um número").int("ID é um número inteiro").positive("ID tem que ser positivo"),
  nome: z.string().min(1, "Nome obrigatório"),
  texto: z.string().min(1, "Texto obrigatório"),
  tipo: z.enum(['MARKETING', 'UTILITY']),
});

export const upchatSchema = z.object({
  url: z.url("URL válida é necessária"),
  queueId: z.coerce.number("Queue ID é necessário ser um número").int("Queue ID é um número inteiro").positive("Queue ID tem que ser positivo"),
  apiKey: z.string(),
  templates: z.array(templateSchema),
});

export const configSchema = z.object({
  config: z.record(z.string(), z.any())
    .refine(
      config => Object.values(config).some(v =>
        typeof v === "string" && v.trim() !== ""
      ),
      {
        message: "Informe ao menos um campo para atualização.",
      }
    ),
});

export const baseIntegracaoSchema = z.object({
  config: z.union([
    ixcSchema,
    upchatSchema
  ]),
});

export const integracaoSchema = z.object({
  nome: z.enum(['WIFEED', 'UPCHAT', 'IXC']),
  config: z.union([ixcSchema, upchatSchema, wifeedSchema]),
});
