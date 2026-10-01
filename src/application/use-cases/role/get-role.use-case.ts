import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { BaseUseCase } from '../_base.use-case';
import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { GetRoleDto } from '@application/dtos/role/get-role.dto';
import { GetRoleResponseDto } from '@application/dtos/role/get-role.response';
import { IRoleRepository, ROLE_REPOSITORY } from '@core/repositories/role.repository';

@Injectable()
export default class GetRoleUseCase extends BaseUseCase<GetRoleDto, GetRoleResponseDto> {
    constructor(
        @Inject(ROLE_REPOSITORY)
        private readonly roleRepository: IRoleRepository,
    ) {
        super();
    }

    async execute(input: GetRoleDto): Promise<GetRoleResponseDto> {
        const roleId = IdentifierVO.reconstitute(input.roleId);
        const role = await this.roleRepository.findById(roleId);
        if (!role) {
            throw new NotFoundException('Role not found');
        }

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
