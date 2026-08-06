import { Module } from '@nestjs/common';

import { PrismaService } from './service/prisma.service';
import { USER_REPOSITORY } from '@core/repositories/user.repository';
import { ROLE_REPOSITORY } from '@core/repositories/role.repository';
import { DEVICE_REPOSITORY } from '@core/repositories/device.repository';
import { SESSION_REPOSITORY } from '@core/repositories/session.repository';
import { PERMISSION_REPOSITORY } from '@core/repositories/permission.repository';
import { UserRepository as PrismaUserRepository } from './repositories/user.repository';
import { RoleRepository as PrismaRoleRepository } from './repositories/role.repository';
import { DeviceRepository as PrismaDeviceRepository } from './repositories/device.repository';
import { SessionRepository as PrismaSessionRepository } from './repositories/session.repository';
import { PermissionRepository as PrismaPermissionRepository } from './repositories/permission.repository';

@Module({
    providers: [
        PrismaService,
        {
            provide: USER_REPOSITORY,
            useClass: PrismaUserRepository,
        },
        {
            provide: ROLE_REPOSITORY,
            useClass: PrismaRoleRepository,
        },
        {
            provide: SESSION_REPOSITORY,
            useClass: PrismaSessionRepository,
        },
        {
            provide: DEVICE_REPOSITORY,
            useClass: PrismaDeviceRepository,
        },
        {
            provide: PERMISSION_REPOSITORY,
            useClass: PrismaPermissionRepository,
        },
    ],
    exports: [USER_REPOSITORY, ROLE_REPOSITORY, SESSION_REPOSITORY, DEVICE_REPOSITORY, PERMISSION_REPOSITORY],
})
export class PrismaModule {}
