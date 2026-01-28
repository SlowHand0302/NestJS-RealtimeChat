import { Role } from '@core/entities/role.entity';
import { IBaseRepository } from './_base.repository';
import { EntityIdVO } from '@core/value-objects/entity-id.vo';

export interface IRoleRepository extends IBaseRepository<Role> {
    findByName(name: string): Promise<Role | null>;
    findByUserId(userId: EntityIdVO): Promise<Role[]>;
    assignRoleToUser(userId: EntityIdVO, roleId: EntityIdVO): Promise<void>;
    removeRoleFromUser(userId: EntityIdVO, roleId: EntityIdVO): Promise<void>;
}
