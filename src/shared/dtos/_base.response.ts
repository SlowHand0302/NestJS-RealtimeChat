import { HttpStatus } from '@nestjs/common';

export interface BaseApiResponse {
    status: HttpStatus;
    message?: string | string[];
    timestamp?: string;
    version?: string;
    path?: string;
}
