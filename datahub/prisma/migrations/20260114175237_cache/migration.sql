-- CreateTable
CREATE UNLOGGED TABLE "cache" (
    "chave" VARCHAR(255) NOT NULL,
    "dados" JSONB NOT NULL,
    "expiresAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cache_pkey" PRIMARY KEY ("chave")
);

-- CreateIndex
CREATE INDEX "cache_expiresAt_idx" ON "cache"("expiresAt");
