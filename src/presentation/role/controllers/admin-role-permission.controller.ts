import {
    Put,
    Body,
    Post,
    Param,
    Delete,
    HttpCode,
    UseGuards,
    Controller,
    HttpStatus,
    ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { PoliciesGuard } from '@infrastructure/guards/policies.guard';
import { SyncRolePermissionsRequestDto } from '../dtos/sync-role-permissions-request.dto';
import { VerifyPolicies } from '@infrastructure/decorators/verify-policies.decorator';
import { CanManageRolesPolicy } from '@infrastructure/casl/policies/can-manage-roles.policy';
import SyncRolePermissionsUseCase from '@application/use-cases/role/sync-role-permisions.use-case';
import AssignPermissionToRoleUseCase from '@application/use-cases/role/assign-permission-to-role.use-case';
import { CanManagePermissionsPolicy } from '@infrastructure/casl/policies/can-manage-permissions.policy';
import RemovePermissionFromRoleUseCase from '@application/use-cases/role/remove-permission-from-role.use-case';

// IdentifierVO.reconstitute only accepts v4 UUIDs, so the pipe must be v4 too — otherwise a
// non-v4 UUID would pass the pipe and surface as a 500 from the value object.
const UUID_V4_PIPE = new ParseUUIDPipe({ version: '4' });

@ApiTags('Admin Role Permissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('admin')
export class AdminRolePermissionController {
    constructor(
        private readonly assignPermissionToRoleUseCase: AssignPermissionToRoleUseCase,
        private readonly removePermissionFromRoleUseCase: RemovePermissionFromRoleUseCase,
        private readonly syncRolePermissionsUseCase: SyncRolePermissionsUseCase,
    ) {}

    @Put('roles/:roleId/permissions')
    @HttpCode(HttpStatus.OK)
    @VerifyPolicies(new CanManageRolesPolicy(), new CanManagePermissionsPolicy())
    @ApiOperation({ summary: "Replace a role's full set of permissions" })
    async syncRolePermissions(
        @Param('roleId', UUID_V4_PIPE) roleId: string,
        @Body() dto: SyncRolePermissionsRequestDto,
    ): Promise<null> {
        await this.syncRolePermissionsUseCase.execute({ roleId, permissionIds: dto.permissionIds });
        return null;
    }

    @Post('roles/:roleId/permissions/:permissionId')
    @HttpCode(HttpStatus.OK)
    @VerifyPolicies(new CanManageRolesPolicy(), new CanManagePermissionsPolicy())
    @ApiOperation({ summary: 'Assign a permission to a role' })
    async assignPermissionToRole(
        @Param('roleId', UUID_V4_PIPE) roleId: string,
        @Param('permissionId', UUID_V4_PIPE) permissionId: string,
    ): Promise<null> {
        await this.assignPermissionToRoleUseCase.execute({ roleId, permissionId });
        return null;
    }

    @Delete('roles/:roleId/permissions/:permissionId')
    @HttpCode(HttpStatus.OK)
    @VerifyPolicies(new CanManageRolesPolicy(), new CanManagePermissionsPolicy())
    @ApiOperation({ summary: 'Remove a permission from a role' })
    async removePermissionFromRole(
        @Param('roleId', UUID_V4_PIPE) roleId: string,
        @Param('permissionId', UUID_V4_PIPE) permissionId: string,
    ): Promise<null> {
        await this.removePermissionFromRoleUseCase.execute({ roleId, permissionId });
        return null;
    }
}
