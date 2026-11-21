import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Post, Param, Delete, HttpCode, UseGuards, Controller, HttpStatus, ParseUUIDPipe } from '@nestjs/common';

import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { PoliciesGuard } from '@infrastructure/guards/policies.guard';
import { VerifyPolicies } from '@infrastructure/decorators/verify-policies.decorator';
import { CanManageRolesPolicy } from '@infrastructure/casl/policies/can-manage-roles.policy';
import { CanManageUsersPolicy } from '@infrastructure/casl/policies/can-manage-users.policy';
import AssignRoleToUserUseCase from '@application/use-cases/role/assign-role-to-user.use-case';
import RemoveRoleFromUserUseCase from '@application/use-cases/role/remove-role-from-use.use-case';

// IdentifierVO.reconstitute only accepts v4 UUIDs, so the pipe must be v4 too — otherwise a
// non-v4 UUID would pass the pipe and surface as a 500 from the value object.
const UUID_V4_PIPE = new ParseUUIDPipe({ version: '4' });

@ApiTags('Admin User Roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('admin')
export class AdminUserRoleController {
    constructor(
        private readonly assignRoleToUserUseCase: AssignRoleToUserUseCase,
        private readonly removeRoleFromUserUseCase: RemoveRoleFromUserUseCase,
    ) {}

    @Post('users/:userId/roles/:roleId')
    @HttpCode(HttpStatus.OK)
    @VerifyPolicies(new CanManageUsersPolicy(), new CanManageRolesPolicy())
    @ApiOperation({ summary: 'Assign a role to a user' })
    async assignRoleToUser(
        @Param('userId', UUID_V4_PIPE) userId: string,
        @Param('roleId', UUID_V4_PIPE) roleId: string,
    ): Promise<null> {
        await this.assignRoleToUserUseCase.execute({ userId, roleId });
        return null;
    }

    @Delete('users/:userId/roles/:roleId')
    @HttpCode(HttpStatus.OK)
    @VerifyPolicies(new CanManageUsersPolicy(), new CanManageRolesPolicy())
    @ApiOperation({ summary: 'Remove a role from a user' })
    async removeRoleFromUser(
        @Param('userId', UUID_V4_PIPE) userId: string,
        @Param('roleId', UUID_V4_PIPE) roleId: string,
    ): Promise<null> {
        await this.removeRoleFromUserUseCase.execute({ userId, roleId });
        return null;
    }
}
