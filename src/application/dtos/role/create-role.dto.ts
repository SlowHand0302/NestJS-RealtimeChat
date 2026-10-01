import { UseCaseInput } from '@application/use-cases/_base.use-case';

export interface CreateRoleDto extends UseCaseInput {
    name: string;
    description?: string;
}
