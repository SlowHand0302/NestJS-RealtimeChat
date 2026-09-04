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

/**
 * Sentinel return type for controllers producing a paginated list.
 * SuccessResponseInterceptor detects instances of this class and reshapes
 * the response into PaginatedApiResponse
 */
export class PaginatedResult<T> {
    constructor(
        public readonly items: T[],
        public readonly total: number,
        public readonly page: number,
        public readonly limit: number,
    ) {}

    get pagination(): PaginatedApiResponse<T>['pagination'] {
        const totalPages = this.limit > 0 ? Math.ceil(this.total / this.limit) : 0;
        return {
            total: this.total,
            page: this.page,
            limit: this.limit,
            totalPages,
            hasNextPage: this.page < totalPages,
            hasPreviousPage: this.page > 1,
        };
    }
}
