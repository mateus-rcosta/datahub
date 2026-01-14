import "dotenv/config";
import { prisma } from "@/lib/database";
import { seedAdmin } from "./seeds/admin.seed";

async function main() {
  console.log("🌱 Iniciando seeds...");

  await seedAdmin();

  console.log("🌱 Seeds finalizadas com sucesso");
}

main()
  .catch((error) => {
    console.error("❌ Erro ao executar seeds:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
