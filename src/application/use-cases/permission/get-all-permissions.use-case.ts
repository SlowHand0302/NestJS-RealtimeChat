import { Inject, Injectable } from '@nestjs/common';

import { BaseUseCase } from '../_base.use-case';
import { FieldOrder, PropsOf } from '@core/criteria/criteria';
import { Permission } from '@core/entities/permission.entity';
import { GetAllPermissionsDto } from '@application/dtos/permission/get-all-permissions.dto';
import { GetAllPermissionsPaginatedResponseDto } from '@application/dtos/permission/get-all-permissions.response';
import { IPermissionRepository, PERMISSION_REPOSITORY } from '@core/repositories/permission.repository';

const DEFAULT_TAKE = 20;
const DEFAULT_SKIP = 0;
const DEFAULT_ORDER_BY: FieldOrder<Permission, keyof PropsOf<Permission>> = { field: 'createdAt', direction: 'desc' };

@Injectable()
export default class GetAllPermissionsUseCase extends BaseUseCase<
    GetAllPermissionsDto,
    GetAllPermissionsPaginatedResponseDto
> {
    constructor(
        @Inject(PERMISSION_REPOSITORY)
        private readonly permissionRepository: IPermissionRepository,
    ) {
        super();
    }

    async execute(input: GetAllPermissionsDto): Promise<GetAllPermissionsPaginatedResponseDto> {
        const filter = input.filter ?? {};

        const [permissions, total] = await Promise.all([
            this.permissionRepository.findAll({
                take: input.take ?? DEFAULT_TAKE,
                skip: input.skip ?? DEFAULT_SKIP,
                orderBy: input.orderBy ?? DEFAULT_ORDER_BY,
                filter,
            }),
            this.permissionRepository.count(filter),
        ]);

        return {
            items: permissions.map((permission) => ({
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
            total,
        };
    }
}
