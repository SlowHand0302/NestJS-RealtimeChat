import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ApiErrorResponse } from '@presentation/http/dtos/shared/error.response';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();

        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        const timestamp = new Date().toISOString();
        const path = request.originalUrl ?? request.url;

        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            const body: ApiErrorResponse = {
                success: false,
                status,
                timestamp,
                path,
            };

            if (typeof exceptionResponse === 'string') {
                body.message = exceptionResponse;
                body.error = exception.name.replace(/Exception$/, '') || HttpStatus[status];
            } else {
                const {
                    error,
                    message,
                }: Pick<Partial<ApiErrorResponse>, 'error' | 'message'> = exceptionResponse as Pick<
                    Partial<ApiErrorResponse>,
                    'error' | 'message'
                >;

                body.error = error;
                body.message = message;
            }

            response.status(status).json(body);
            return;
        }

        this.logger.error(exception instanceof Error ? exception.stack : exception);

        const body: ApiErrorResponse = {
            success: false,
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
            error: 'Internal server error',
            timestamp,
            path,
        };

        response.status(500).json(body);
    }
}
