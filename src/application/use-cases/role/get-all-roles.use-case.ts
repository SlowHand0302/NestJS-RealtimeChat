import { Inject, Injectable } from '@nestjs/common';

import { BaseUseCase } from '../_base.use-case';
import { Role } from '@core/entities/role.entity';
import { FieldOrder, PropsOf } from '@core/criteria/criteria';
import { GetAllRolesDto } from '@application/dtos/role/get-all-roles.dto';
import { GetAllRolesPaginatedResponseDto } from '@application/dtos/role/get-all-roles.response';
import { IRoleRepository, ROLE_REPOSITORY } from '@core/repositories/role.repository';

const DEFAULT_TAKE = 20;
const DEFAULT_SKIP = 0;
const DEFAULT_ORDER_BY: FieldOrder<Role, keyof PropsOf<Role>> = { field: 'createdAt', direction: 'desc' };

@Injectable()
export default class GetAllRolesUseCase extends BaseUseCase<GetAllRolesDto, GetAllRolesPaginatedResponseDto> {
    constructor(
        @Inject(ROLE_REPOSITORY)
        private readonly roleRepository: IRoleRepository,
    ) {
        super();
    }

    async execute(input: GetAllRolesDto): Promise<GetAllRolesPaginatedResponseDto> {
        const filter = input.filter ?? {};

        const [roles, total] = await Promise.all([
            this.roleRepository.findAll({
                take: input.take ?? DEFAULT_TAKE,
                skip: input.skip ?? DEFAULT_SKIP,
                orderBy: input.orderBy ?? DEFAULT_ORDER_BY,
                filter,
            }),
            this.roleRepository.count(filter),
        ]);

        return {
            items: roles.map((role) => ({
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
            })),
            total,
        };
    }
}
