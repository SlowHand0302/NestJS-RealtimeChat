import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { SessionModule } from './session/session.module';
import { PermissionModule } from './permission/permission.module';

@Module({
    imports: [AuthModule, UserModule, SessionModule, PermissionModule, RoleModule],
})
export class PresentationModule {}
