import { Inject, Injectable, NotFoundException, ConflictException } from '@nestjs/common';

import { BaseUseCase } from '../_base.use-case';
import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { UserRoleDto } from '@application/dtos/role/user-role.dto';
import { IRoleRepository, ROLE_REPOSITORY } from '@core/repositories/role.repository';

@Injectable()
export default class AssignRoleToUserUseCase extends BaseUseCase<UserRoleDto, void> {
    constructor(
        @Inject(ROLE_REPOSITORY)
        private readonly roleRepository: IRoleRepository,
    ) {
        super();
    }

    async execute(input: UserRoleDto): Promise<void> {
        const userId = IdentifierVO.reconstitute(input.userId);
        const roleId = IdentifierVO.reconstitute(input.roleId);

        const role = await this.roleRepository.findById(roleId);
        if (!role) {
            throw new NotFoundException('Role not found');
        }

        const userRoles = await this.roleRepository.findByUserId(userId);
        if (userRoles.some((r) => r.id.equals(roleId))) {
            throw new ConflictException('Role is already assigned to this user');
        }

        await this.roleRepository.assignRoleToUser(userId, roleId);
    }
}
