import { map, Observable } from 'rxjs';
import { Request, Response } from 'express';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { ApiSuccessResponse } from '@presentation/shared/dtos/success.response';
import { PaginatedApiResponse, PaginatedResult } from '@presentation/shared/dtos/paginated.response';

@Injectable()
export class SuccessResponseInterceptor<T> implements NestInterceptor<
    T,
    ApiSuccessResponse<T> | PaginatedApiResponse<T>
> {
    intercept(
        context: ExecutionContext,
        next: CallHandler<T>,
    ): Observable<ApiSuccessResponse<T> | PaginatedApiResponse<T>> {
        const http = context.switchToHttp();
        const request = http.getRequest<Request>();
        const response = http.getResponse<Response>();

        return next.handle().pipe(
            map((data): ApiSuccessResponse<T> | PaginatedApiResponse<T> => {
                const base = {
                    success: true as const,
                    status: response.statusCode,
                    timestamp: new Date().toISOString(),
                    request: request.originalUrl ?? request.url,
                };

                if (data instanceof PaginatedResult) {
                    return {
                        ...base,
                        data: data.items,
                        pagination: data.pagination,
                    } as PaginatedApiResponse<T>;
                }
                return { ...base, data };
            }),
        );
    }
}
