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

import { Role } from '@core/entities/role.entity';
import { RoleResponseDto } from '../dtos/role-response.dto';
import { ROLE_SEARCH_CONFIG } from '../role-search.config';
import { PaginatedResult } from '@shared/dtos/paginated.response';
import { SearchRequestDto } from '@shared/dtos/search-request.dto';
import { CreateRoleRequestDto } from '../dtos/create-role-request.dto';
import { UpdateRoleRequestDto } from '../dtos/update-role-request.dto';
import { FieldOrder, FilterCondition, PropsOf } from '@core/criteria/criteria';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { PoliciesGuard } from '@infrastructure/guards/policies.guard';
import { SearchQueryPipe } from '@infrastructure/pipes/search-query.pipe';
import GetRoleUseCase from '@application/use-cases/role/get-role.use-case';
import CreateRoleUseCase from '@application/use-cases/role/create-role.use-case';
import UpdateRoleUseCase from '@application/use-cases/role/update-role.use-case';
import DeleteRoleUseCase from '@application/use-cases/role/delete-role.use-case';
import ArchiveRoleUseCase from '@application/use-cases/role/archive-role.use-case';
import RestoreRoleUseCase from '@application/use-cases/role/restore-role.use-case';
import GetAllRolesUseCase from '@application/use-cases/role/get-all-roles.use-case';
import { VerifyPolicies } from '@infrastructure/decorators/verify-policies.decorator';
import { CanManageRolesPolicy } from '@infrastructure/casl/policies/can-manage-roles.policy';

// IdentifierVO.reconstitute only accepts v4 UUIDs, so the pipe must be v4 too — otherwise a
// non-v4 UUID would pass the pipe and surface as a 500 from the value object.
const UUID_V4_PIPE = new ParseUUIDPipe({ version: '4' });

@ApiTags('Admin Roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('admin')
export class AdminRoleController {
    constructor(
        private readonly createRoleUseCase: CreateRoleUseCase,
        private readonly getRoleUseCase: GetRoleUseCase,
        private readonly getAllRolesUseCase: GetAllRolesUseCase,
        private readonly updateRoleUseCase: UpdateRoleUseCase,
        private readonly archiveRoleUseCase: ArchiveRoleUseCase,
        private readonly restoreRoleUseCase: RestoreRoleUseCase,
        private readonly deleteRoleUseCase: DeleteRoleUseCase,
    ) {}

    @Post('roles')
    @HttpCode(HttpStatus.CREATED)
    @VerifyPolicies(new CanManageRolesPolicy())
    @ApiOperation({ summary: 'Create a role' })
    @ApiCreatedResponse({ type: RoleResponseDto })
    async createRole(@Body() dto: CreateRoleRequestDto): Promise<RoleResponseDto> {
        return this.createRoleUseCase.execute({
            name: dto.name,
            description: dto.description,
        });
    }

    @Post('roles/search')
    @HttpCode(HttpStatus.OK)
    @VerifyPolicies(new CanManageRolesPolicy())
    @ApiOperation({ summary: 'Search roles with filter, sort and pagination' })
    @ApiOkResponse({ type: RoleResponseDto, isArray: true })
    async searchRoles(
        // The parameter is typed as the shared request class so the global ValidationPipe validates
        // page/limit first; SearchQueryPipe then validates sort/filter and converts date strings.
        @Body(new SearchQueryPipe<Role>(ROLE_SEARCH_CONFIG))
        query: SearchRequestDto<FilterCondition<Role, keyof PropsOf<Role>>, FieldOrder<Role, keyof PropsOf<Role>>>,
    ): Promise<PaginatedResult<RoleResponseDto>> {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;

        const { items, total } = await this.getAllRolesUseCase.execute({
            take: limit,
            skip: (page - 1) * limit,
            orderBy: query.sort,
            filter: query.filter,
        });

        return new PaginatedResult(items, total, page, limit);
    }

    @Get('roles/:roleId')
    @VerifyPolicies(new CanManageRolesPolicy())
    @ApiOperation({ summary: 'Get a role by id' })
    @ApiOkResponse({ type: RoleResponseDto })
    async getRole(@Param('roleId', UUID_V4_PIPE) roleId: string): Promise<RoleResponseDto> {
        return this.getRoleUseCase.execute({ roleId });
    }

    @Patch('roles/:roleId')
    @VerifyPolicies(new CanManageRolesPolicy())
    @ApiOperation({ summary: 'Update a role (partial)' })
    @ApiOkResponse({ type: RoleResponseDto })
    async updateRole(
        @Param('roleId', UUID_V4_PIPE) roleId: string,
        @Body() dto: UpdateRoleRequestDto,
    ): Promise<RoleResponseDto> {
        return this.updateRoleUseCase.execute({
            roleId,
            name: dto.name,
            description: dto.description,
        });
    }

    @Post('roles/:roleId/archive')
    @HttpCode(HttpStatus.OK)
    @VerifyPolicies(new CanManageRolesPolicy())
    @ApiOperation({ summary: 'Archive (soft-delete) a role' })
    async archiveRole(@Param('roleId', UUID_V4_PIPE) roleId: string): Promise<null> {
        await this.archiveRoleUseCase.execute({ roleId });
        return null;
    }

    @Post('roles/:roleId/restore')
    @HttpCode(HttpStatus.OK)
    @VerifyPolicies(new CanManageRolesPolicy())
    @ApiOperation({ summary: 'Restore an archived role' })
    async restoreRole(@Param('roleId', UUID_V4_PIPE) roleId: string): Promise<null> {
        await this.restoreRoleUseCase.execute({ roleId });
        return null;
    }

    @Delete('roles/:roleId')
    @HttpCode(HttpStatus.OK)
    @VerifyPolicies(new CanManageRolesPolicy())
    @ApiOperation({ summary: 'Permanently delete an archived role' })
    async deleteRole(@Param('roleId', UUID_V4_PIPE) roleId: string): Promise<null> {
        await this.deleteRoleUseCase.execute({ roleId });
        return null;
    }
}
