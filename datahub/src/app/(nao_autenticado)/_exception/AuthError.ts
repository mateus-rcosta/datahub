export enum AuthErrorType {
  CREDENCIAIS_INVALIDAS = "CREDENCIAIS_INVALIDAS",
  ERRO_INTERNO = "ERRO_INTERNO"
}

export class AuthError extends Error {
    code:AuthErrorType;
    constructor(code:AuthErrorType) {
        super();
        this.code = code;
    }
}