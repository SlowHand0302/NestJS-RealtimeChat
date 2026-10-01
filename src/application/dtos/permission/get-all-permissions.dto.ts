import { UseCaseInput } from '@application/use-cases/_base.use-case';
import { FieldOrder, FilterCondition, PropsOf } from '@core/criteria/criteria';
import { Permission } from '@core/entities/permission.entity';

export interface GetAllPermissionsDto extends UseCaseInput {
    take?: number;
    skip?: number;
    orderBy?: FieldOrder<Permission, keyof PropsOf<Permission>>;
    filter?: FilterCondition<Permission, keyof PropsOf<Permission>>;
}
