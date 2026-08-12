import { Module } from '@nestjs/common';
import { CoreModule } from '@core/core.module';
import SignUpUseCase from './use-cases/auth/sign-up.use-case';
import { SignInUseCase } from './use-cases/auth/sign-in.use-case';
import { SignOutUseCase } from './use-cases/auth/sign-out.use-case';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { RefreshTokenUseCase } from './use-cases/auth/refresh-token.use-case';
import { SignOutAllUseCase } from './use-cases/auth/sign-out-all-session.use-case';
import { GetCurrentUserUseCase } from './use-cases/user/get-current-user.use-case';
import { GetActiveSessionUseCase } from './use-cases/session/get-active-session.use-case';

@Module({
    imports: [InfrastructureModule, CoreModule],
    providers: [
        SignInUseCase,
        SignUpUseCase,
        SignOutUseCase,
        SignOutAllUseCase,
        RefreshTokenUseCase,
        GetCurrentUserUseCase,
        GetActiveSessionUseCase,
    ],
    exports: [
        SignInUseCase,
        SignUpUseCase,
        SignOutUseCase,
        SignOutAllUseCase,
        RefreshTokenUseCase,
        GetCurrentUserUseCase,
        GetActiveSessionUseCase,
    ],
})
export class ApplicationModule {}
