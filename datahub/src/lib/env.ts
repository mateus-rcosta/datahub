import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.url(),

  NODE_ENV: z.enum(["development", "test", "production"]),

  JWT_SECRET: z.string().min(32).default("supersenhasecretaparapodeutilizaremdesenvolvimento"),

  JWT_EXPIRE_TIME_HOURS: z.coerce.number().int().positive().default(8),

  APP_URL: z.url().default("http://localhost:3000"),

  SALT_ROUNDS: z.coerce.number().int().positive().default(10),

  UPCHAT_QUEUE_ID: z.string().min(1),

  UPCHAT_API_KEY: z.string().min(1),

  UPCHAT_URL: z.string().min(1),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Variáveis de ambiente inválidas:");
  console.error(_env.error.issues.map((issue) => `${issue.code} - ${issue.message}`));
  throw new Error("Erro ao validar variáveis de ambiente");
}

export const env = _env.data;