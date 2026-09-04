import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { SessionResponseDto } from '../dtos/session-response.dto';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { PaginationQueryDto } from '@presentation/shared/dtos/pagination.dto';
import { PaginatedResult } from '@presentation/shared/dtos/paginated.response';
import { CurrentUser } from '@infrastructure/decorators/current-user.decorator';
import { AuthenticatedPrincipal } from '@infrastructure/principals/authenticated.principal';
import GetActiveSessionUseCase from '@application/use-cases/session/get-active-session.use-case';

@ApiTags('Sessions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users/me/sessions')
export class SelfSessionController {
    constructor(private readonly getActiveSessionUseCase: GetActiveSessionUseCase) {}

    @Get()
    @ApiOperation({ summary: "List the current user's active sessions" })
    @ApiOkResponse({ type: SessionResponseDto, isArray: true })
    async getActiveSessions(
        @CurrentUser() principal: AuthenticatedPrincipal,
        @Query() query: PaginationQueryDto,
    ): Promise<PaginatedResult<SessionResponseDto>> {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;

        const { items, total } = await this.getActiveSessionUseCase.execute({
            userId: principal.id,
            take: limit,
            skip: (page - 1) * limit,
        });

        return new PaginatedResult(items, total, page, limit);
    }
}
