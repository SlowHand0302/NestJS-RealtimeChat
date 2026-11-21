import { Module } from '@nestjs/common';
import { CaslModule } from '@infrastructure/casl/casl.module';
import { ApplicationModule } from '@application/application.module';
import { AdminRoleController } from './controllers/admin-role.controller';
import { AdminUserRoleController } from './controllers/admin-user-role.controller';
import { AdminRolePermissionController } from './controllers/admin-role-permission.controller';

@Module({
    imports: [ApplicationModule, CaslModule],
    controllers: [AdminRoleController, AdminRolePermissionController, AdminUserRoleController],
})
export class RoleModule {}
