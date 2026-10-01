import { Inject, Injectable, ConflictException, NotFoundException } from '@nestjs/common';

import { BaseUseCase } from '../_base.use-case';
import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { UpdateRoleDto } from '@application/dtos/role/update-role.dto';
import { GetRoleResponseDto } from '@application/dtos/role/get-role.response';
import { IRoleRepository, ROLE_REPOSITORY } from '@core/repositories/role.repository';

@Injectable()
export default class UpdateRoleUseCase extends BaseUseCase<UpdateRoleDto, GetRoleResponseDto> {
    constructor(
        @Inject(ROLE_REPOSITORY)
        private readonly roleRepository: IRoleRepository,
    ) {
        super();
    }

    async execute(input: UpdateRoleDto): Promise<GetRoleResponseDto> {
        const roleId = IdentifierVO.reconstitute(input.roleId);
        const role = await this.roleRepository.findById(roleId);
        if (!role) {
            throw new NotFoundException('Role not found');
        }

        if (input.name !== undefined) {
            const conflicting = await this.roleRepository.findByName(input.name);
            if (conflicting && !conflicting.id.equals(role.id)) {
                throw new ConflictException(`Role with name "${input.name}" already exists`);
            }
            role.rename(input.name);
        }

        if (input.description !== undefined) {
            role.updateDescription(input.description);
        }

        await this.roleRepository.update(role.id, role);

        return {
            id: role.id.value,
            name: role.name,
            description: role.description,
            permissions: role.permissions.map((permission) => ({
                id: permission.id.value,
                action: permission.action,
                subject: permission.subject,
                description: permission.description,
                conditions: permission.conditions,
                fields: permission.fields,
                inverted: permission.inverted,
                deletedAt: permission.deletedAt ?? null,
                createdAt: permission.createdAt,
                updatedAt: permission.updatedAt,
            })),
            deletedAt: role.deletedAt ?? null,
            createdAt: role.createdAt,
            updatedAt: role.updatedAt,
        };
    }
}
