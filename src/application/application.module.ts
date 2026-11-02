import { Module } from '@nestjs/common';
import { CoreModule } from '@core/core.module';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';

import SignUpUseCase from './use-cases/auth/sign-up.use-case';
import SignInUseCase from './use-cases/auth/sign-in.use-case';
import SignOutUseCase from './use-cases/auth/sign-out.use-case';
import RefreshTokenUseCase from './use-cases/auth/refresh-token.use-case';
import SignOutAllUseCase from './use-cases/auth/sign-out-all-session.use-case';
import GetCurrentUserUseCase from './use-cases/user/get-current-user.use-case';
import RevokeSessionUseCase from './use-cases/session/revoke-session.use-case';
import GetPermissionUseCase from './use-cases/permission/get-permission.use-case';
import CreatePermissionUseCase from './use-cases/permission/create-permission.use-case';
import UpdatePermissionUseCase from './use-cases/permission/update-permission.use-case';
import DeletePermissionUseCase from './use-cases/permission/delete-permission.use-case';
import GetActiveSessionUseCase from './use-cases/session/get-active-session.use-case';
import ArchivePermissionUseCase from './use-cases/permission/archive-permission.use-case';
import RestorePermissionUseCase from './use-cases/permission/restore-permission.use-case';
import GetAllPermissionsUseCase from './use-cases/permission/get-all-permissions.use-case';
import RevokeAllSessionsOfUserUseCase from './use-cases/session/revoke-all-sessions-of-user.use-case';
import GetActiveSessionsOfAllUsersUseCase from './use-cases/session/get-active-sessions-of-all-users.use-case';

@Module({
    imports: [InfrastructureModule, CoreModule],
    providers: [
        SignInUseCase,
        SignUpUseCase,
        SignOutUseCase,
        SignOutAllUseCase,
        RefreshTokenUseCase,
        RevokeSessionUseCase,
        GetCurrentUserUseCase,
        GetActiveSessionUseCase,
        RevokeAllSessionsOfUserUseCase,
        GetActiveSessionsOfAllUsersUseCase,
        CreatePermissionUseCase,
        GetPermissionUseCase,
        GetAllPermissionsUseCase,
        UpdatePermissionUseCase,
        ArchivePermissionUseCase,
        RestorePermissionUseCase,
        DeletePermissionUseCase,
    ],
    exports: [
        SignInUseCase,
        SignUpUseCase,
        SignOutUseCase,
        SignOutAllUseCase,
        RefreshTokenUseCase,
        RevokeSessionUseCase,
        GetCurrentUserUseCase,
        GetActiveSessionUseCase,
        RevokeAllSessionsOfUserUseCase,
        GetActiveSessionsOfAllUsersUseCase,
        CreatePermissionUseCase,
        GetPermissionUseCase,
        GetAllPermissionsUseCase,
        UpdatePermissionUseCase,
        ArchivePermissionUseCase,
        RestorePermissionUseCase,
        DeletePermissionUseCase,
    ],
})
export class ApplicationModule {}
