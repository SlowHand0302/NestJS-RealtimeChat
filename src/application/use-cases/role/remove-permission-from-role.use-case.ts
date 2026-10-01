import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { BaseUseCase } from '../_base.use-case';
import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { RolePermissionDto } from '@application/dtos/role/role-permission.dto';
import { IRoleRepository, ROLE_REPOSITORY } from '@core/repositories/role.repository';
import { IPermissionRepository, PERMISSION_REPOSITORY } from '@core/repositories/permission.repository';

@Injectable()
export default class RemovePermissionFromRoleUseCase extends BaseUseCase<RolePermissionDto, void> {
    constructor(
        @Inject(ROLE_REPOSITORY)
        private readonly roleRepository: IRoleRepository,
        @Inject(PERMISSION_REPOSITORY)
        private readonly permissionRepository: IPermissionRepository,
    ) {
        super();
    }

    async execute(input: RolePermissionDto): Promise<void> {
        const roleId = IdentifierVO.reconstitute(input.roleId);
        const permissionId = IdentifierVO.reconstitute(input.permissionId);

        const [role, permission] = await Promise.all([
            this.roleRepository.findById(roleId),
            this.permissionRepository.findById(permissionId),
        ]);
        if (!role) throw new NotFoundException('Role not found');
        if (!permission) throw new NotFoundException('Permission not found');

        try {
            role.revokePermission(permission);
        } catch (error) {
            throw new NotFoundException(error instanceof Error ? error.message : 'Permission not assigned to role');
        }

        await this.roleRepository.removePermissionFromRole(roleId, permissionId);
    }
}
