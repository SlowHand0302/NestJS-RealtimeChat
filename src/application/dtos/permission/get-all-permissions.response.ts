import { UseCaseOutput } from '@application/use-cases/_base.use-case';
import { GetPermissionResponseDto } from './get-permission.response';

export interface GetAllPermissionsPaginatedResponseDto extends UseCaseOutput {
    items: GetPermissionResponseDto[];
    total: number;
}
