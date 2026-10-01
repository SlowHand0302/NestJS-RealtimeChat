import { UseCaseInput } from '@application/use-cases/_base.use-case';

export interface PermissionIdDto extends UseCaseInput {
    permissionId: string;
}
