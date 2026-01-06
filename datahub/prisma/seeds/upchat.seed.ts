import { prisma } from "@/lib/database";
import { env } from "@/lib/env";
import { IntegracaoJSONBUpchat } from "@/types/types";
import { InputJsonValue } from "@prisma/client/runtime/client";

export async function seedUpchat() {
  const existente = await prisma.integracao.findFirst({
    where: { nome: "Upchat" },
  });

  if (existente) {
    console.log("✔ Integração UpChat já cadastrada");
    return;
  }

  const config: IntegracaoJSONBUpchat = {
    queueId: env.UPCHAT_QUEUE_ID,
    apiKey: env.UPCHAT_API_KEY,
    templates: [
      {
        id: "24",
        nome: "novidade",
        texto: "Olá {{1}}, está sabendo da novidade?",
        tipo: "MARKETING",
      },
    ],
  };

  await prisma.integracao.create({
    data: {
      nome: "Upchat",
      status: false,
      config: config as unknown as InputJsonValue,
    },
  });

  console.log("✔ Integração UpChat criada com sucesso");
}
