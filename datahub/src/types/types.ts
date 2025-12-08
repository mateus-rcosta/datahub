import { JsonValue } from "@prisma/client/runtime/client";

// Usuário
export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha?: string;
  admin: boolean;
  ativo: boolean;
  permissoes: {
    editar_base_dados: boolean;
    visualizar_relatorios: boolean;
    editar_campanhas: boolean;
    editar_integracoes: boolean;
  } & JsonValue;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface RetornarUsuarios {
  pesquisa: string;
  page?: number;
  limit?: number;
}

export interface CriarUsuarioInput {
  nome: string;
  email: string;
  senha: string;
  admin?: boolean;
  editar_base_dados?: boolean;
  visualizar_relatorios?: boolean;
  editar_campanhas?: boolean;
  editar_integracoes?: boolean;
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
