export enum UserErrorType {
  EMAIL_EM_USO = "EMAIL_EM_USO",
  SENHA_INVALIDA = "SENHA_INVALIDA",
  DADOS_INVALIDOS = "DADOS_INVALIDOS",
  USUARIO_NAO_ENCONTRADO = "USUARIO_NAO_ENCONTRADO",
  USUARIO_NAO_PODE_SE_EXCLUIR = "USUARIO_NAO_PODE_SE_EXCLUIR",
  ADMIN_NAO_PODE_SER_ALTERADO = "ADMIN_NAO_PODE_SER_ALTERADO"
}

export class UserError extends Error {
    code:UserErrorType;
    validacao?:string[]
    constructor(code:UserErrorType, message:string, validacao?:string[]) {
        super(message);
        this.code = code;
        this.validacao = validacao;
    }
}