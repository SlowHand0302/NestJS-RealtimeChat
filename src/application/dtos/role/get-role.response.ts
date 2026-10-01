import { UseCaseOutput } from '@application/use-cases/_base.use-case';
import { GetPermissionResponseDto } from '@application/dtos/permission/get-permission.response';

export interface GetRoleResponseDto extends UseCaseOutput {
    id: string;
    name: string;
    description: string;
    permissions: GetPermissionResponseDto[];
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
