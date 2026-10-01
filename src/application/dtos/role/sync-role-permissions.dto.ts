import { UseCaseInput } from '@application/use-cases/_base.use-case';

export interface SyncRolePermissionsDto extends UseCaseInput {
    roleId: string;
    permissionIds: string[];
}
