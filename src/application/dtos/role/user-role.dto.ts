import { UseCaseInput } from '@application/use-cases/_base.use-case';

export interface UserRoleDto extends UseCaseInput {
    userId: string;
    roleId: string;
}
