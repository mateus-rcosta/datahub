export class ApiError extends Error {
  code: number;
  codeError: string | null;
  data: unknown;

  constructor(message: string, code: number, codeError: string | null = null, data: unknown = null) {
    super(message);
    this.code = code;
    this.codeError = codeError;
    this.data = data;
  }
}
