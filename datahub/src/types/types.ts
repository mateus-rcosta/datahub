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

export interface RetornarUsuarios {
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
  data: T[];
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrevious: boolean;
  total: number;
}

export interface ApiSuccesso<T = unknown> {
  success: true;
  data: T;
}

export interface ApiFalha {
  success: false;
  code: string;
  message?: string;
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