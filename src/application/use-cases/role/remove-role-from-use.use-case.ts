import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { BaseUseCase } from '../_base.use-case';
import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { UserRoleDto } from '@application/dtos/role/user-role.dto';
import { IRoleRepository, ROLE_REPOSITORY } from '@core/repositories/role.repository';

@Injectable()
export default class RemoveRoleFromUserUseCase extends BaseUseCase<UserRoleDto, void> {
    constructor(
        @Inject(ROLE_REPOSITORY)
        private readonly roleRepository: IRoleRepository,
    ) {
        super();
    }

    async execute(input: UserRoleDto): Promise<void> {
        const userId = IdentifierVO.reconstitute(input.userId);
        const roleId = IdentifierVO.reconstitute(input.roleId);

        const userRoles = await this.roleRepository.findByUserId(userId);
        if (!userRoles.some((r) => r.id.equals(roleId))) {
            throw new NotFoundException('Role is not assigned to this user');
        }

        await this.roleRepository.removeRoleFromUser(userId, roleId);
    }
}
