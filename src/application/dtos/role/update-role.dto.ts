import { UseCaseInput } from '@application/use-cases/_base.use-case';

export interface UpdateRoleDto extends UseCaseInput {
    roleId: string;
    name?: string;
    description?: string;
}
