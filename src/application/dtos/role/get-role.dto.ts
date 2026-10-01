import { UseCaseInput } from '@application/use-cases/_base.use-case';

export interface GetRoleDto extends UseCaseInput {
    roleId: string;
}
