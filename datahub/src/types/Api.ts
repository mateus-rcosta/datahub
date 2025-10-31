interface ApiPagination<T>{
    data: T[],
    page: number,
    limit: number,
    hasNext: boolean,
    hasPrevious: boolean,
    total: number
}