import z from "zod";

const clientEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  NEXT_PUBLIC_APP_URL: z.url(),
});

const parsed = clientEnvSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

if (!parsed.success) {
  console.error("❌ Variáveis de ambiente inválidas (CLIENT):");
  console.error(parsed.error.issues.map((issue) => `${issue.code} - ${issue.message}`));
  throw new Error("Erro ao validar variáveis de ambiente do client");
}

export const envClient = parsed.data;