export enum IntegracaoErrorType {
    INTEGRACAO_NAO_ENCONTRADA = "INTEGRACAO_NAO_ENCONTRADA",
    INTEGRACAO_NAO_SUPORTADA = "INTEGRACAO_NAO_SUPORTADA",
    VALIDACAO_FALHOU = "VALIDACAO_FALHOU",
    INTEGRACAO_CONFIG_INVALIDA = "INTEGRACAO_CONFIG_INVALIDA",
}

export class IntegracaoError extends Error {
    code:IntegracaoErrorType;
    validacao?:string[]
    constructor(code:IntegracaoErrorType, message:string, validacao?:string[]) {
        super(message);
        this.code = code;
        this.validacao = validacao;
    }
}