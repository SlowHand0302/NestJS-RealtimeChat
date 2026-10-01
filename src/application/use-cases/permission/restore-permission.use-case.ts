import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { BaseUseCase } from '../_base.use-case';
import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { PermissionIdDto } from '@application/dtos/permission/permission-id.dto';
import { IPermissionRepository, PERMISSION_REPOSITORY } from '@core/repositories/permission.repository';

@Injectable()
export default class RestorePermissionUseCase extends BaseUseCase<PermissionIdDto, void> {
    constructor(
        @Inject(PERMISSION_REPOSITORY)
        private readonly permissionRepository: IPermissionRepository,
    ) {
        super();
    }

    async execute(input: PermissionIdDto): Promise<void> {
        const permissionId = IdentifierVO.reconstitute(input.permissionId);
        const permission = await this.permissionRepository.findById(permissionId);
        if (!permission) {
            throw new NotFoundException('Permission not found');
        }
        if (!permission.isDeleted()) {
            throw new ConflictException('Permission is not archived');
        }
        await this.permissionRepository.restore(permissionId);
    }
}
