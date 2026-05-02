import { Permission, PermissionActionPropEnum } from '@core/entities/permission.entity';
import { IBaseRepository } from './_base.repository';

export interface IPermissionRepository extends IBaseRepository<Permission> {
    findByResourceAndAction(subject: string, action: PermissionActionPropEnum): Promise<Permission | null>;
}
