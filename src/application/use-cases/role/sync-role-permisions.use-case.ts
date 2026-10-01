import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

import { BaseUseCase } from '../_base.use-case';
import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { SyncRolePermissionsDto } from '@application/dtos/role/sync-role-permissions.dto';
import { IRoleRepository, ROLE_REPOSITORY } from '@core/repositories/role.repository';
import { IPermissionRepository, PERMISSION_REPOSITORY } from '@core/repositories/permission.repository';

@Injectable()
export default class SyncRolePermissionsUseCase extends BaseUseCase<SyncRolePermissionsDto, void> {
    constructor(
        @Inject(ROLE_REPOSITORY)
        private readonly roleRepository: IRoleRepository,
        @Inject(PERMISSION_REPOSITORY)
        private readonly permissionRepository: IPermissionRepository,
    ) {
        super();
    }

    async execute(input: SyncRolePermissionsDto): Promise<void> {
        const roleId = IdentifierVO.reconstitute(input.roleId);
        const role = await this.roleRepository.findById(roleId);
        if (!role) {
            throw new NotFoundException('Role not found');
        }

        const permissionIds = input.permissionIds.map((id) => IdentifierVO.reconstitute(id));

        if (permissionIds.length > 0) {
            const count = await this.permissionRepository.count({
                id: { operator: 'in', value: permissionIds },
            });
            if (count !== permissionIds.length) {
                throw new BadRequestException('One or more permissions do not exist');
            }
        }

        await this.roleRepository.syncRolePermissions(roleId, permissionIds);
    }
}
