export enum SessaoErrorType {
  USUARIO_NAO_LOGADO = "USUARIO_NAO_LOGADO",
  ASSINATURA_INVALIDA = "ASSINATURA_INVALIDA",
  TOKEN_EXPIRADO = "TOKEN_EXPIRADO",
  TOKEN_INVALIDO = "TOKEN_INVALIDO",
}

export class SessaoError extends Error {
  constructor(
    public code: SessaoErrorType,
    message: string
  ) {
    super(message);
    this.name = "SessaoError";
  }
}