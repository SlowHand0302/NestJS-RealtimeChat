import { Inject, Injectable, ConflictException } from '@nestjs/common';

import { BaseUseCase } from '../_base.use-case';
import { Permission } from '@core/entities/permission.entity';
import { CreatePermissionDto } from '@application/dtos/permission/create-permission.dto';
import { GetPermissionResponseDto } from '@application/dtos/permission/get-permission.response';
import { IPermissionRepository, PERMISSION_REPOSITORY } from '@core/repositories/permission.repository';

@Injectable()
export default class CreatePermissionUseCase extends BaseUseCase<CreatePermissionDto, GetPermissionResponseDto> {
    constructor(
        @Inject(PERMISSION_REPOSITORY)
        private readonly permissionRepository: IPermissionRepository,
    ) {
        super();
    }

    async execute(input: CreatePermissionDto): Promise<GetPermissionResponseDto> {
        const existing = await this.permissionRepository.findByResourceAndAction(input.subject, input.action);
        if (existing) {
            throw new ConflictException(
                `Permission for subject "${input.subject}" and action "${input.action}" already exists`,
            );
        }

        const permission = Permission.create(input.action, input.subject, {
            description: input.description,
            conditions: input.conditions,
            fields: input.fields,
            inverted: input.inverted,
        });

        await this.permissionRepository.create(permission);

        return {
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
        };
    }
}
