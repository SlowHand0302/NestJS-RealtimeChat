import { map, Observable } from 'rxjs';
import { Request, Response } from 'express';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { ApiSuccessResponse } from '@presentation/http/dtos/shared/success.response';

@Injectable()
export class SuccessResponseInterceptor<T> implements NestInterceptor<T, ApiSuccessResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiSuccessResponse<T>> {
        const http = context.switchToHttp();
        const request = http.getRequest<Request>();
        const response = http.getResponse<Response>();

        return next.handle().pipe(
            map(
                (data): ApiSuccessResponse<T> => ({
                    success: true,
                    status: response.statusCode,
                    timestamp: new Date().toISOString(),
                    path: request.originalUrl ?? request.url,
                    data,
                }),
            ),
        );
    }
}
