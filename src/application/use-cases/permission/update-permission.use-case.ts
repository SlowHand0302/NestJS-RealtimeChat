import { Inject, Injectable, ConflictException, NotFoundException } from '@nestjs/common';

import { BaseUseCase } from '../_base.use-case';
import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { UpdatePermissionDto } from '@application/dtos/permission/update-permission.dto';
import { GetPermissionResponseDto } from '@application/dtos/permission/get-permission.response';
import { IPermissionRepository, PERMISSION_REPOSITORY } from '@core/repositories/permission.repository';

@Injectable()
export default class UpdatePermissionUseCase extends BaseUseCase<UpdatePermissionDto, GetPermissionResponseDto> {
    constructor(
        @Inject(PERMISSION_REPOSITORY)
        private readonly permissionRepository: IPermissionRepository,
    ) {
        super();
    }

    async execute(input: UpdatePermissionDto): Promise<GetPermissionResponseDto> {
        const permissionId = IdentifierVO.reconstitute(input.permissionId);
        const permission = await this.permissionRepository.findById(permissionId);
        if (!permission) {
            throw new NotFoundException('Permission not found');
        }

        if (input.action !== undefined || input.subject !== undefined) {
            const nextSubject = input.subject ?? permission.subject;
            const nextAction = input.action ?? permission.action;
            const conflicting = await this.permissionRepository.findByResourceAndAction(nextSubject, nextAction);
            if (conflicting && !conflicting.id.equals(permission.id)) {
                throw new ConflictException(
                    `Permission for subject "${nextSubject}" and action "${nextAction}" already exists`,
                );
            }
        }

        if (input.action !== undefined) permission.updateAction(input.action);
        if (input.subject !== undefined) permission.updateSubject(input.subject);
        if (input.description !== undefined) permission.updateDescription(input.description);
        if (input.conditions !== undefined) permission.updateConditions(input.conditions);
        if (input.fields !== undefined) permission.updateFields(input.fields);
        if (input.inverted !== undefined) permission.updateInverted(input.inverted);

        await this.permissionRepository.update(permission.id, permission);

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
