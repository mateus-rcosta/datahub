-- CreateTable
CREATE TABLE "integracoes" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "config" JSONB NOT NULL,
    "updatedAt" TIMESTAMPTZ,

    CONSTRAINT "integracoes_pkey" PRIMARY KEY ("id")
);
