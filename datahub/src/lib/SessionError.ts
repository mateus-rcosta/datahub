export enum SessionErrorType {
  USUARIO_NAO_LOGADO = "USUARIO_NAO_LOGADO"
}

export class SessionError extends Error {
    code:SessionErrorType;
    constructor(code:SessionErrorType, message:string) {
        super(message);
        this.code = code;
    }
}