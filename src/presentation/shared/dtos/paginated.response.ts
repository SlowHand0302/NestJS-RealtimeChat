import { ApiSuccessResponse } from './success.response';

export interface PaginatedApiResponse<T> extends ApiSuccessResponse<T[]> {
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}
