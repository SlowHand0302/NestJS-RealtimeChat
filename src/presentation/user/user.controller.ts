import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserResponseDto } from './dtos/user-response.dto';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '@infrastructure/decorators/current-user.decorator';
import GetCurrentUserUseCase from '@application/use-cases/user/get-current-user.use-case';
import { AuthenticatedPrincipal } from '@infrastructure/principals/authenticated.principal';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
    constructor(private readonly getCurrentUserUseCase: GetCurrentUserUseCase) {}

    @Get('me')
    @ApiOperation({ summary: 'Get the currently authenticated user' })
    @ApiOkResponse({ type: UserResponseDto })
    async getCurrentUser(@CurrentUser() principal: AuthenticatedPrincipal): Promise<UserResponseDto> {
        return this.getCurrentUserUseCase.execute({ userId: principal.id });
    }
}
