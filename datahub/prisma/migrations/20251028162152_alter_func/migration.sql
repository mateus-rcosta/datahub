/*
  Warnings:

  - You are about to alter the column `nome` on the `funcionario` table. The data in that column could be lost. The data in that column will be cast from `VarChar(200)` to `VarChar(120)`.
  - You are about to alter the column `email` on the `funcionario` table. The data in that column could be lost. The data in that column will be cast from `VarChar(200)` to `VarChar(120)`.
  - You are about to alter the column `senha` on the `funcionario` table. The data in that column could be lost. The data in that column will be cast from `VarChar(200)` to `VarChar(60)`.

*/
-- AlterTable
ALTER TABLE "public"."funcionario" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "nome" SET DATA TYPE VARCHAR(120),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(120),
ALTER COLUMN "senha" SET DATA TYPE VARCHAR(60);
