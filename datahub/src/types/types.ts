import { InputJsonValue, JsonValue } from "@prisma/client/runtime/client";
import { JWTPayload } from "jose";

// Usuário
export interface JSONBUsuarioPermissoes {
  super_admin?: boolean;
  editar_base_dados: boolean;
  visualizar_relatorios: boolean;
  editar_campanhas: boolean;
  editar_integracoes: boolean;
}

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
  code: number;
  code_error?:string;
  mensagem?: string;
  validacao?: Record<string, string[]>;
}

export interface PageParams {
  pesquisa: string;
  page: number;
  limit: number;
  campos?: string[];
  campoPesquisa?: string;
}

// Sessao
export interface AuthPayload extends JWTPayload {
  usuarioId: string;
  email: string;
  admin: boolean;
  permissoes: string[];
}

export interface JSONBSessaoDados {
  ip: string;
  userAgent: string;
}

// Base de dados
export interface BaseDados {
  id: string;
  nome: string;
  clientes?: number;
  usuarioNome?: string
  estrutura: string[];
  createdAt: string | Date;
  updatedAt?: string | Date;
}

// Cliente
export interface LinhaCsv { [key: string]: string | null | undefined; }

export interface Cliente {
  id: string;
  dados: InputJsonValue | JsonValue;
  validacao: InputJsonValue | JsonValue;
  baseDeDadosId: string;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
}

export interface PostCliente {
  dados: InputJsonValue;
  validacao?: InputJsonValue;
  baseDeDadosId: string;
}

// Integracao
export interface Integracao<IntegracaoDados> {
  id: number;
  nome: string;
  config: IntegracaoDados;
  status: boolean;
  updatedAt?: string | Date | null;
}

export interface IntegracaoJSONBUpchat {
  queueId: string;
  apiKey: string;
  templates: IntegracaoJSONBUpchatTemplate[];
}

export interface IntegracaoJSONBIXC {
  token: string;
}


export interface IntegracaoJSONBUpchatTemplate{
  id: string;
  nome: string;
  texto: string;
  tipo: 'MARKETING' | 'UTILITY';
}

export type IntegracaoDados = IntegracaoJSONBUpchat | IntegracaoJSONBIXC;

// IntegracaoHealtchek 

export interface IntegracaoHealthcheckUpchat {
  name: string;
  connected: boolean; // porém não autenticado, precisa se autenticar para utilizar
  authenticated: boolean; // após conectado é autenticado
  enabled: boolean; // se habilitado ou não por comando de admin
}