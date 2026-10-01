import { UseCaseInput } from '@application/use-cases/_base.use-case';

export interface RolePermissionDto extends UseCaseInput {
    roleId: string;
    permissionId: string;
}
