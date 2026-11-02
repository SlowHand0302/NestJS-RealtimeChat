import {
    Get,
    Body,
    Post,
    Param,
    Patch,
    Delete,
    HttpCode,
    UseGuards,
    Controller,
    HttpStatus,
    ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Permission } from '@core/entities/permission.entity';
import { PaginatedResult } from '@shared/dtos/paginated.response';
import { SearchRequestDto } from '@shared/dtos/search-request.dto';
import { PermissionResponseDto } from '../dtos/permission-response.dto';
import { PERMISSION_SEARCH_CONFIG } from '../permission-search.config';
import { FieldOrder, FilterCondition, PropsOf } from '@core/criteria/criteria';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { PoliciesGuard } from '@infrastructure/guards/policies.guard';
import { SearchQueryPipe } from '@infrastructure/pipes/search-query.pipe';
import { CreatePermissionRequestDto } from '../dtos/create-permission-request.dto';
import { UpdatePermissionRequestDto } from '../dtos/update-permission-request.dto';
import { VerifyPolicies } from '@infrastructure/decorators/verify-policies.decorator';
import GetPermissionUseCase from '@application/use-cases/permission/get-permission.use-case';
import CreatePermissionUseCase from '@application/use-cases/permission/create-permission.use-case';
import UpdatePermissionUseCase from '@application/use-cases/permission/update-permission.use-case';
import DeletePermissionUseCase from '@application/use-cases/permission/delete-permission.use-case';
import ArchivePermissionUseCase from '@application/use-cases/permission/archive-permission.use-case';
import RestorePermissionUseCase from '@application/use-cases/permission/restore-permission.use-case';
import GetAllPermissionsUseCase from '@application/use-cases/permission/get-all-permissions.use-case';
import { CanManagePermissionsPolicy } from '@infrastructure/casl/policies/can-manage-permissions.policy';

// IdentifierVO.reconstitute only accepts v4 UUIDs, so the pipe must be v4 too — otherwise a
// non-v4 UUID would pass the pipe and surface as a 500 from the value object.
const PERMISSION_ID_PIPE = new ParseUUIDPipe({ version: '4' });

@ApiTags('Admin Permissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('admin')
export class AdminPermissionController {
    constructor(
        private readonly createPermissionUseCase: CreatePermissionUseCase,
        private readonly getPermissionUseCase: GetPermissionUseCase,
        private readonly getAllPermissionsUseCase: GetAllPermissionsUseCase,
        private readonly updatePermissionUseCase: UpdatePermissionUseCase,
        private readonly archivePermissionUseCase: ArchivePermissionUseCase,
        private readonly restorePermissionUseCase: RestorePermissionUseCase,
        private readonly deletePermissionUseCase: DeletePermissionUseCase,
    ) {}

    @Post('permissions')
    @HttpCode(HttpStatus.CREATED)
    @VerifyPolicies(new CanManagePermissionsPolicy())
    @ApiOperation({ summary: 'Create a permission' })
    @ApiCreatedResponse({ type: PermissionResponseDto })
    async createPermission(@Body() dto: CreatePermissionRequestDto): Promise<PermissionResponseDto> {
        return this.createPermissionUseCase.execute({
            action: dto.action,
            subject: dto.subject,
            description: dto.description,
            conditions: dto.conditions,
            fields: dto.fields,
            inverted: dto.inverted,
        });
    }

    @Post('permissions/search')
    @HttpCode(HttpStatus.OK)
    @VerifyPolicies(new CanManagePermissionsPolicy())
    @ApiOperation({ summary: 'Search permissions with filter, sort and pagination' })
    @ApiOkResponse({ type: PermissionResponseDto, isArray: true })
    async searchPermissions(
        // The parameter is typed as the shared request class so the global ValidationPipe validates
        // page/limit first; SearchQueryPipe then validates sort/filter and converts date strings.
        @Body(new SearchQueryPipe<Permission>(PERMISSION_SEARCH_CONFIG))
        query: SearchRequestDto<
            FilterCondition<Permission, keyof PropsOf<Permission>>,
            FieldOrder<Permission, keyof PropsOf<Permission>>
        >,
    ): Promise<PaginatedResult<PermissionResponseDto>> {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;

        const { items, total } = await this.getAllPermissionsUseCase.execute({
            take: limit,
            skip: (page - 1) * limit,
            orderBy: query.sort,
            filter: query.filter,
        });

        return new PaginatedResult(items, total, page, limit);
    }

    @Get('permissions/:permissionId')
    @VerifyPolicies(new CanManagePermissionsPolicy())
    @ApiOperation({ summary: 'Get a permission by id' })
    @ApiOkResponse({ type: PermissionResponseDto })
    async getPermission(
        @Param('permissionId', PERMISSION_ID_PIPE) permissionId: string,
    ): Promise<PermissionResponseDto> {
        return this.getPermissionUseCase.execute({ permissionId });
    }

    @Patch('permissions/:permissionId')
    @VerifyPolicies(new CanManagePermissionsPolicy())
    @ApiOperation({ summary: 'Update a permission (partial)' })
    @ApiOkResponse({ type: PermissionResponseDto })
    async updatePermission(
        @Param('permissionId', PERMISSION_ID_PIPE) permissionId: string,
        @Body() dto: UpdatePermissionRequestDto,
    ): Promise<PermissionResponseDto> {
        return this.updatePermissionUseCase.execute({
            permissionId,
            action: dto.action,
            subject: dto.subject,
            description: dto.description,
            conditions: dto.conditions,
            fields: dto.fields,
            inverted: dto.inverted,
        });
    }

    @Post('permissions/:permissionId/archive')
    @HttpCode(HttpStatus.OK)
    @VerifyPolicies(new CanManagePermissionsPolicy())
    @ApiOperation({ summary: 'Archive (soft-delete) a permission' })
    async archivePermission(@Param('permissionId', PERMISSION_ID_PIPE) permissionId: string): Promise<null> {
        await this.archivePermissionUseCase.execute({ permissionId });
        return null;
    }

    @Post('permissions/:permissionId/restore')
    @HttpCode(HttpStatus.OK)
    @VerifyPolicies(new CanManagePermissionsPolicy())
    @ApiOperation({ summary: 'Restore an archived permission' })
    async restorePermission(@Param('permissionId', PERMISSION_ID_PIPE) permissionId: string): Promise<null> {
        await this.restorePermissionUseCase.execute({ permissionId });
        return null;
    }

    @Delete('permissions/:permissionId')
    @HttpCode(HttpStatus.OK)
    @VerifyPolicies(new CanManagePermissionsPolicy())
    @ApiOperation({ summary: 'Permanently delete an archived permission' })
    async deletePermission(@Param('permissionId', PERMISSION_ID_PIPE) permissionId: string): Promise<null> {
        await this.deletePermissionUseCase.execute({ permissionId });
        return null;
    }
}
