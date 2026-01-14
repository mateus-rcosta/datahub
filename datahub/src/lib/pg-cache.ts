"use server";
import { prisma } from "./database";

type CacheOptions = {
  ttlSegundos?: number; // Alternativa mais ergonômica que expiresAt
  expiresAt?: Date;
};

export const insereCache = async ( chave: string, dados: unknown, options?: CacheOptions ) => {
  const cache = JSON.stringify(dados);
  
  const expiresAt = options?.expiresAt ?? 
    (options?.ttlSegundos ? new Date(Date.now() + options.ttlSegundos * 1000) : undefined);

  await prisma.cache.upsert({
    where: { chave },
    update: {
      dados: cache,
      expiresAt
    },
    create: {
      chave,
      dados: cache,
      expiresAt,
      createdAt: new Date()
    }
  });
  
  return true;
};

export const obtemCache = async <T = unknown>(chave: string): Promise<T | null> => {
  const cache = await prisma.cache.findUnique({
    where: {
      chave,
      expiresAt: { gt: new Date() }
    },
    select: {
      dados: true
    }
  });
  
  if (cache) {
    return JSON.parse(cache.dados as string) as T;
  }
  
  return null;
};

export const removeCache = async (chave: string) => {
  await prisma.cache.delete({ where: { chave } });
};