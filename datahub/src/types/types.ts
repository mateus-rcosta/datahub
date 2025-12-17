import { InputJsonValue } from "@prisma/client/runtime/client";
import { JWTPayload } from "jose";

// Usuário
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha?: string;
  admin: boolean;
  ativo: boolean;
  permissoes: JSONBUsuarioPermissoes;
  createdAt?: Date;
  updatedAt?: Date | null;
}

export interface PageParams {
  pesquisa: string;
  page: number;
  limit: number;
}

export interface CriarUsuarioInput {
  nome: string;
  email: string;
  senha: string;
  admin?: boolean;
  permissoes: JSONBUsuarioPermissoes;
}

// api
export interface ApiPagination<T> {
  dados: T[];
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrevious: boolean;
  total: number;
}

export interface ApiSuccesso<T = unknown> {
  sucesso: true;
  dados: T;
}

export interface ApiFalha {
  sucesso: false;
  code: string;
  mensagem?: string;
  validacao?: Record<string, string[]>;
}

export interface JSONBUsuarioPermissoes {
  super_admin?: boolean;
  editar_base_dados: boolean;
  visualizar_relatorios: boolean;
  editar_campanhas: boolean;
  editar_integracoes: boolean;
}

export interface AuthPayload extends JWTPayload{
    usuarioId: string;
    email: string;
    admin: boolean;
    permissoes: string[];
}

export interface JSONBSessaoDados{
    ip: string;
    userAgent: string;
}

export interface PostCliente {
    dados: InputJsonValue;
    validacao?: InputJsonValue;
    baseDeDadosId: string;
}

export interface BaseDados{
    id: string;
    nome: string;
    clientes?: number;
    createdAt: Date;
    updatedAt?: Date;
}
export interface LinhaCsv { [key: string]: string | null | undefined; }