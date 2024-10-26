type PaginationState<T> = BaseState<T> & {
    pagination: {
        page: number,
        pageSize: number,
        totalCount: number,
    }
}

type BaseModel = {
    active?: boolean;
    _id?: string;
    createdAt?: string;
    updatedAt?: string;
}

type BaseState<T> = {
    loading: boolean | null,
    submitting?: boolean | null,
    error: any,
    data?: T,
}