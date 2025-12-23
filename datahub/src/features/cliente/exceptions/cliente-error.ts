export enum ClienteErrorType {
  CLIENTE_NAO_ENCONTRADO = "CLIENTE_NAO_ENCONTRADO",
}

export class ClienteError extends Error {
    code:ClienteErrorType;
    constructor(code:ClienteErrorType, message:string) {
        super(message);
        this.code = code;
    }
}