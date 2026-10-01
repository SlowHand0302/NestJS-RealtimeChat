import { Role } from '@core/entities/role.entity';
import { UseCaseInput } from '@application/use-cases/_base.use-case';
import { FieldOrder, FilterCondition, PropsOf } from '@core/criteria/criteria';

export interface GetAllRolesDto extends UseCaseInput {
    take?: number;
    skip?: number;
    orderBy?: FieldOrder<Role, keyof PropsOf<Role>>;
    filter?: FilterCondition<Role, keyof PropsOf<Role>>;
}
