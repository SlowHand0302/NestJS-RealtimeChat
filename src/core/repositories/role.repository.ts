import { Role } from '@core/entities/role.entity';
import { IBaseRepository } from './_base.repository';
import { IdentifierVO } from '@core/value-objects/identifier.vo';

export const ROLE_REPOSITORY = Symbol('IRoleRepository');

export interface IRoleRepository extends IBaseRepository<Role> {
    findByName(name: string): Promise<Role | null>;
    findByUserId(userId: IdentifierVO): Promise<Role[]>;
    assignRoleToUser(userId: IdentifierVO, roleId: IdentifierVO): Promise<void>;
    removeRoleFromUser(userId: IdentifierVO, roleId: IdentifierVO): Promise<void>;
    syncUserRoles(userId: IdentifierVO, roleIds: IdentifierVO[]): Promise<void>;
    assignPermissionToRole(roleId: IdentifierVO, permissionId: IdentifierVO): Promise<void>;
    removePermissionFromRole(roleId: IdentifierVO, permissionId: IdentifierVO): Promise<void>;
    syncRolePermissions(roleId: IdentifierVO, permissionIds: IdentifierVO[]): Promise<void>;
}
