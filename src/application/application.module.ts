import { Module } from '@nestjs/common';
import { CoreModule } from '@core/core.module';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';

import SignUpUseCase from './use-cases/auth/sign-up.use-case';
import SignInUseCase from './use-cases/auth/sign-in.use-case';
import SignOutUseCase from './use-cases/auth/sign-out.use-case';
import GetRoleUseCase from './use-cases/role/get-role.use-case';
import CreateRoleUseCase from './use-cases/role/create-role.use-case';
import UpdateRoleUseCase from './use-cases/role/update-role.use-case';
import DeleteRoleUseCase from './use-cases/role/delete-role.use-case';
import ArchiveRoleUseCase from './use-cases/role/archive-role.use-case';
import RestoreRoleUseCase from './use-cases/role/restore-role.use-case';
import GetAllRolesUseCase from './use-cases/role/get-all-roles.use-case';
import RefreshTokenUseCase from './use-cases/auth/refresh-token.use-case';
import SignOutAllUseCase from './use-cases/auth/sign-out-all-session.use-case';
import GetCurrentUserUseCase from './use-cases/user/get-current-user.use-case';
import RevokeSessionUseCase from './use-cases/session/revoke-session.use-case';
import AssignRoleToUserUseCase from './use-cases/role/assign-role-to-user.use-case';
import GetPermissionUseCase from './use-cases/permission/get-permission.use-case';
import SyncRolePermissionsUseCase from './use-cases/role/sync-role-permisions.use-case';
import RemoveRoleFromUserUseCase from './use-cases/role/remove-role-from-use.use-case';
import CreatePermissionUseCase from './use-cases/permission/create-permission.use-case';
import UpdatePermissionUseCase from './use-cases/permission/update-permission.use-case';
import DeletePermissionUseCase from './use-cases/permission/delete-permission.use-case';
import GetActiveSessionUseCase from './use-cases/session/get-active-session.use-case';
import ArchivePermissionUseCase from './use-cases/permission/archive-permission.use-case';
import RestorePermissionUseCase from './use-cases/permission/restore-permission.use-case';
import GetAllPermissionsUseCase from './use-cases/permission/get-all-permissions.use-case';
import AssignPermissionToRoleUseCase from './use-cases/role/assign-permission-to-role.use-case';
import RemovePermissionFromRoleUseCase from './use-cases/role/remove-permission-from-role.use-case';
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
        CreateRoleUseCase,
        GetRoleUseCase,
        GetAllRolesUseCase,
        UpdateRoleUseCase,
        ArchiveRoleUseCase,
        RestoreRoleUseCase,
        DeleteRoleUseCase,
        AssignPermissionToRoleUseCase,
        RemovePermissionFromRoleUseCase,
        SyncRolePermissionsUseCase,
        AssignRoleToUserUseCase,
        RemoveRoleFromUserUseCase,
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
        CreateRoleUseCase,
        GetRoleUseCase,
        GetAllRolesUseCase,
        UpdateRoleUseCase,
        ArchiveRoleUseCase,
        RestoreRoleUseCase,
        DeleteRoleUseCase,
        AssignPermissionToRoleUseCase,
        RemovePermissionFromRoleUseCase,
        SyncRolePermissionsUseCase,
        AssignRoleToUserUseCase,
        RemoveRoleFromUserUseCase,
    ],
})
export class ApplicationModule {}
