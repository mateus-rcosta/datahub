import z from "zod";

export const ixcSchema = z.object({
  token: z.string().min(1, "Token obrigatório"),
});

const templateSchema = z.object({
  id: z.string().min(1, "ID obrigatório"),
  nome: z.string().min(1, "Nome obrigatório"),
  texto: z.string().min(1, "Texto obrigatório"),
  tipo: z.enum(['MARKETING', 'UTILITY']),
});

export const upchatSchema = z.object({
  queueId: z.string().min(1, "Queue ID obrigatório"),
  apiKey: z.string().min(1, "API Key obrigatória"),
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
    // IXC
    ixcSchema,
    // Upchat
    upchatSchema 
  ]),
});

export const integracaoSchemaId = z.object({
  id: z.number(),
  config: z.union([ixcSchema, upchatSchema]),
});
