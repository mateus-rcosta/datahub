export enum BaseDadosErrorType {
  CSV_INVALIDO = 'CSV_INVALIDO',
  CSV_SEM_COLUNAS_OBRIGATORIAS = 'CSV_SEM_COLUNAS_OBRIGATORIAS',
}

export class BaseDadosError extends Error {
    code:BaseDadosErrorType;
    validacao?:string[]
    constructor(code:BaseDadosErrorType, message:string, validacao?:string[]) {
        super(message);
        this.code = code;
        this.validacao = validacao;
    }
}