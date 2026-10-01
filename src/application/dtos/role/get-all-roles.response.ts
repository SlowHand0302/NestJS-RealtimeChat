import { UseCaseOutput } from '@application/use-cases/_base.use-case';
import { GetRoleResponseDto } from './get-role.response';

export interface GetAllRolesPaginatedResponseDto extends UseCaseOutput {
    items: GetRoleResponseDto[];
    total: number;
}
