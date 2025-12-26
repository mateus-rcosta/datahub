import "dotenv/config";
import { prisma } from "@/lib/database";
import { seedAdmin } from "./seeds/admin.seed";
import { seedUpchat } from "./seeds/upchat.seed";

async function main() {
  console.log("🌱 Iniciando seeds...");

  await seedAdmin();
  await seedUpchat();

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
