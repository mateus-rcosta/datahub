/*
  Warnings:

  - You are about to drop the `funcionario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "funcionario";

-- CreateTable
CREATE TABLE "usuario" (
    "id" UUID NOT NULL,
    "nome" VARCHAR(120) NOT NULL,
    "email" VARCHAR(120) NOT NULL,
    "senha" VARCHAR(60) NOT NULL,
    "permissoes" JSONB,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3),
    "deletedAt" TIMESTAMPTZ(3),

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessao" (
    "id" SERIAL NOT NULL,
    "sid" UUID NOT NULL,
    "dados" JSONB NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiredAt" TIMESTAMPTZ(3),
    "revokedAt" TIMESTAMPTZ(3),
    "usuarioId" UUID NOT NULL,

    CONSTRAINT "sessao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessao_sid_key" ON "sessao"("sid");

-- AddForeignKey
ALTER TABLE "sessao" ADD CONSTRAINT "sessao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
