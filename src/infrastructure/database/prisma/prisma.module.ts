import { Module } from '@nestjs/common';
import { PrismaService } from './service/prisma.service';
import { UserRepository } from './repositories/user.repository';
import { RoleRepository } from './repositories/role.repository';
import { PermissionRepository } from './repositories/permission.repository';

@Module({
    providers: [PrismaService, UserRepository, RoleRepository, PermissionRepository],
    exports: [UserRepository, RoleRepository, PermissionRepository],
})
export class PrismaModule {}
