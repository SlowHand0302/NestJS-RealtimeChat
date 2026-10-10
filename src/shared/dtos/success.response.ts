import { BaseApiResponse } from './_base.response';

export interface ApiSuccessResponse<T = unknown> extends BaseApiResponse {
    success: true;
    data: T;
}
