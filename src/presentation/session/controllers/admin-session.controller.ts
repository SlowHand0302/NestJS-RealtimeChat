import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Get, Delete, Param, Query, HttpCode, UseGuards, Controller, HttpStatus, ParseUUIDPipe } from '@nestjs/common';

import { SessionResponseDto } from '../dtos/session-response.dto';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { PoliciesGuard } from '@infrastructure/guards/policies.guard';
import { AdminSessionResponseDto } from '../dtos/admin-session-response.dto';
import { PaginationQueryDto } from '@presentation/shared/dtos/pagination.dto';
import { PaginatedResult } from '@presentation/shared/dtos/paginated.response';
import { VerifyPolicies } from '@infrastructure/decorators/verify-policies.decorator';
import RevokeSessionUseCase from '@application/use-cases/session/revoke-session.use-case';
import { CanReadSessionsPolicy } from '@infrastructure/casl/policies/can-read-sessions.policy';
import GetActiveSessionUseCase from '@application/use-cases/session/get-active-session.use-case';
import { CanManageSessionsPolicy } from '@infrastructure/casl/policies/can-manage-sessions.policy';
import RevokeAllSessionsOfUserUseCase from '@application/use-cases/session/revoke-all-sessions-of-user.use-case';
import GetActiveSessionsOfAllUsersUseCase from '@application/use-cases/session/get-active-sessions-of-all-users.use-case';

@ApiTags('Admin Sessions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('admin')
export class AdminSessionController {
    constructor(
        private readonly getActiveSessionUseCase: GetActiveSessionUseCase,
        private readonly getActiveSessionsOfAllUsersUseCase: GetActiveSessionsOfAllUsersUseCase,
        private readonly revokeSessionUseCase: RevokeSessionUseCase,
        private readonly revokeAllSessionsOfUserUseCase: RevokeAllSessionsOfUserUseCase,
    ) {}

    @Get('sessions')
    @VerifyPolicies(new CanReadSessionsPolicy())
    @ApiOperation({ summary: 'List active sessions across all users' })
    @ApiOkResponse({ type: AdminSessionResponseDto, isArray: true })
    async getAllActiveSessions(@Query() query: PaginationQueryDto): Promise<PaginatedResult<AdminSessionResponseDto>> {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;

        const { items, total } = await this.getActiveSessionsOfAllUsersUseCase.execute({
            take: limit,
            skip: (page - 1) * limit,
        });

        return new PaginatedResult(items, total, page, limit);
    }

    @Get('users/:userId/sessions')
    @VerifyPolicies(new CanReadSessionsPolicy())
    @ApiOperation({ summary: "List a specific user's active sessions" })
    @ApiOkResponse({ type: SessionResponseDto, isArray: true })
    async getActiveSessionsForUser(
        @Param('userId', ParseUUIDPipe) userId: string,
        @Query() query: PaginationQueryDto,
    ): Promise<PaginatedResult<SessionResponseDto>> {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;

        const { items, total } = await this.getActiveSessionUseCase.execute({
            userId,
            take: limit,
            skip: (page - 1) * limit,
        });

        return new PaginatedResult(items, total, page, limit);
    }

    @Delete('users/:userId/sessions/:sessionId')
    @HttpCode(HttpStatus.OK)
    @VerifyPolicies(new CanManageSessionsPolicy())
    @ApiOperation({ summary: 'Force sign-out a single session belonging to a user' })
    async revokeSession(
        @Param('userId', ParseUUIDPipe) userId: string,
        @Param('sessionId', ParseUUIDPipe) sessionId: string,
    ): Promise<null> {
        await this.revokeSessionUseCase.execute({ userId, sessionId });
        return null;
    }

    @Delete('users/:userId/sessions')
    @HttpCode(HttpStatus.OK)
    @VerifyPolicies(new CanManageSessionsPolicy())
    @ApiOperation({ summary: 'Force sign-out all sessions for a user' })
    async revokeAllSessionsForUser(@Param('userId', ParseUUIDPipe) userId: string): Promise<null> {
        await this.revokeAllSessionsOfUserUseCase.execute({ userId });
        return null;
    }
}
