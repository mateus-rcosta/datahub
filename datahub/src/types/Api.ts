// types.ts
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
