import {
    Req,
    Res,
    Post,
    Body,
    HttpCode,
    UseGuards,
    Controller,
    HttpStatus,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { SignUpRequestDto } from './dtos/sign-up-request.dto';
import { SignInRequestDto } from './dtos/sign-in-request.dto';
import { SignUpResponseDto } from './dtos/sign-up-response.dto';
import { SignInResponseDto } from './dtos/sign-in-response.dto';
import { CookieConfig } from '@infrastructure/config/cookie.config';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { parseDurationToMs } from '@infrastructure/utils/duration.util';
import SignInUseCase from '@application/use-cases/auth/sign-in.use-case';
import SignUpUseCase from '@application/use-cases/auth/sign-up.use-case';
import { RefreshTokenResponseDto } from './dtos/refresh-token-response.dto';
import SignOutUseCase from '@application/use-cases/auth/sign-out.use-case';
import { CurrentUser } from '@infrastructure/decorators/current-user.decorator';
import RefreshTokenUseCase from '@application/use-cases/auth/refresh-token.use-case';
import { JwtRefreshTokenGuard } from '@infrastructure/guards/jwt-refresh-token.guard';
import SignOutAllUseCase from '@application/use-cases/auth/sign-out-all-session.use-case';
import { AuthenticatedPrincipal } from '@infrastructure/principals/authenticated.principal';
import { CurrentRefreshUser } from '@infrastructure/decorators/current-refresh-user.decorator';
import { RefreshAuthenticatedPrincipal } from '@infrastructure/principals/refresh-authenticated.principal';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    private readonly cookieConfig: CookieConfig;

    constructor(
        private readonly signUpUseCase: SignUpUseCase,
        private readonly signInUseCase: SignInUseCase,
        private readonly signOutUseCase: SignOutUseCase,
        private readonly signOutAllUseCase: SignOutAllUseCase,
        private readonly refreshTokenUseCase: RefreshTokenUseCase,
        private readonly configService: ConfigService,
    ) {
        this.cookieConfig = this.configService.getOrThrow<CookieConfig>('cookie');
    }

    @Post('sign-up')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Register a new account' })
    @ApiCreatedResponse({ type: SignUpResponseDto })
    async signUp(@Body() dto: SignUpRequestDto): Promise<SignUpResponseDto> {
        return this.signUpUseCase.execute({
            email: dto.email,
            password: dto.password,
        });
    }

    @Post('sign-in')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Sign in and start a new session' })
    @ApiOkResponse({ type: SignInResponseDto })
    async signIn(
        @Body() dto: SignInRequestDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<SignInResponseDto> {
        const result = await this.signInUseCase.execute({
            email: dto.email,
            password: dto.password,
            clientDeviceId: dto.clientDeviceId,
            deviceName: dto.deviceName,
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
        });

        this.setRefreshTokenCookie(res, result.tokens.refreshToken);

        return {
            user: result.user,
            tokens: {
                accessToken: result.tokens.accessToken,
            },
            session: result.session,
        };
    }

    @Post('sign-out')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Sign out the current session' })
    async signOut(
        @CurrentUser() principal: AuthenticatedPrincipal,
        @Res({ passthrough: true }) res: Response,
    ): Promise<null> {
        if (!principal.sessionId) {
            throw new UnauthorizedException('Access token does not carry a session');
        }

        await this.signOutUseCase.execute({ sessionId: principal.sessionId });
        this.clearRefreshTokenCookie(res);

        return null;
    }

    @Post('sign-out/all')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Sign out of all sessions/devices' })
    async signOutAll(
        @CurrentUser() principal: AuthenticatedPrincipal,
        @Res({ passthrough: true }) res: Response,
    ): Promise<null> {
        await this.signOutAllUseCase.execute({ userId: principal.id });
        this.clearRefreshTokenCookie(res);

        return null;
    }

    @Post('refresh-token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtRefreshTokenGuard)
    @ApiOperation({ summary: 'Rotate refresh token and issue a new access token' })
    @ApiOkResponse({ type: RefreshTokenResponseDto })
    async refreshToken(
        @CurrentRefreshUser() principal: RefreshAuthenticatedPrincipal,
        @Res({ passthrough: true }) res: Response,
    ): Promise<RefreshTokenResponseDto> {
        const result = await this.refreshTokenUseCase.execute({
            refreshToken: principal.refreshToken,
        });

        this.setRefreshTokenCookie(res, result.tokens.refreshToken);

        return { accessToken: result.tokens.accessToken };
    }

    private setRefreshTokenCookie(res: Response, refreshToken: string): void {
        res.cookie(this.cookieConfig.name, refreshToken, {
            httpOnly: this.cookieConfig.httpOnly,
            path: this.cookieConfig.path,
            secure: this.cookieConfig.secure,
            sameSite: this.cookieConfig.sameSite,
            domain: this.cookieConfig.domain,
            maxAge: parseDurationToMs(this.cookieConfig.refreshTokenExpiresIn),
        });
    }

    private clearRefreshTokenCookie(res: Response): void {
        res.clearCookie(this.cookieConfig.name, {
            path: this.cookieConfig.path,
            domain: this.cookieConfig.domain,
        });
    }
}
