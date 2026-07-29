import { BaseApiResponse } from './_base.response';

export interface ApiErrorResponse extends BaseApiResponse {
    success: false;
    error?: string | Record<string, unknown>;
}
