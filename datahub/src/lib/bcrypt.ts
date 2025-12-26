import bcrypt from "bcrypt";
import { env } from "./env";

const SALT_ROUNDS = env.SALT_ROUNDS;

export async function gerarHash(senha: string): Promise<string> {
  return bcrypt.hash(senha, SALT_ROUNDS);
}

export async function compararHash(senha: string, hash: string): Promise<boolean> {
  return bcrypt.compare(senha, hash);
}