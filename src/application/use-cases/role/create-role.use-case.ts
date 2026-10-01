import { Inject, Injectable, ConflictException } from '@nestjs/common';

import { BaseUseCase } from '../_base.use-case';
import { Role } from '@core/entities/role.entity';
import { CreateRoleDto } from '@application/dtos/role/create-role.dto';
import { GetRoleResponseDto } from '@application/dtos/role/get-role.response';
import { IRoleRepository, ROLE_REPOSITORY } from '@core/repositories/role.repository';

@Injectable()
export default class CreateRoleUseCase extends BaseUseCase<CreateRoleDto, GetRoleResponseDto> {
    constructor(
        @Inject(ROLE_REPOSITORY)
        private readonly roleRepository: IRoleRepository,
    ) {
        super();
    }

    async execute(input: CreateRoleDto): Promise<GetRoleResponseDto> {
        const existing = await this.roleRepository.findByName(input.name);
        if (existing) {
            throw new ConflictException(`Role with name "${input.name}" already exists`);
        }

        const role = Role.create(input.name, [], input.description);
        await this.roleRepository.create(role);

        return {
            id: role.id.value,
            name: role.name,
            description: role.description,
            permissions: [],
            deletedAt: role.deletedAt ?? null,
            createdAt: role.createdAt,
            updatedAt: role.updatedAt,
        };
    }
}
