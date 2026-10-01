import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { BaseUseCase } from '../_base.use-case';
import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { GetPermissionDto } from '@application/dtos/permission/get-permission.dto';
import { GetPermissionResponseDto } from '@application/dtos/permission/get-permission.response';
import { IPermissionRepository, PERMISSION_REPOSITORY } from '@core/repositories/permission.repository';

@Injectable()
export default class GetPermissionUseCase extends BaseUseCase<GetPermissionDto, GetPermissionResponseDto> {
    constructor(
        @Inject(PERMISSION_REPOSITORY)
        private readonly permissionRepository: IPermissionRepository,
    ) {
        super();
    }

    async execute(input: GetPermissionDto): Promise<GetPermissionResponseDto> {
        const permissionId = IdentifierVO.reconstitute(input.permissionId);
        const permission = await this.permissionRepository.findById(permissionId);
        if (!permission) {
            throw new NotFoundException('Permission not found');
        }

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
