import { Inject, Injectable, NotFoundException, ConflictException } from '@nestjs/common';

import { BaseUseCase } from '../_base.use-case';
import { RoleIdDto } from '@application/dtos/role/role-id.dto';
import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { IRoleRepository, ROLE_REPOSITORY } from '@core/repositories/role.repository';

@Injectable()
export default class ArchiveRoleUseCase extends BaseUseCase<RoleIdDto, void> {
    constructor(
        @Inject(ROLE_REPOSITORY)
        private readonly roleRepository: IRoleRepository,
    ) {
        super();
    }

    async execute(input: RoleIdDto): Promise<void> {
        const roleId = IdentifierVO.reconstitute(input.roleId);
        const role = await this.roleRepository.findById(roleId);
        if (!role) {
            throw new NotFoundException('Role not found');
        }
        if (role.isDeleted()) {
            throw new ConflictException('Role is already archived');
        }
        await this.roleRepository.archive(roleId);
    }
}
