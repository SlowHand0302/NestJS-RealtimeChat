import { Module } from '@nestjs/common';
import { CaslModule } from '@infrastructure/casl/casl.module';
import { ApplicationModule } from '@application/application.module';
import { AdminPermissionController } from './controllers/admin-permission.controller';

@Module({
    imports: [ApplicationModule, CaslModule],
    controllers: [AdminPermissionController],
})
export class PermissionModule {}
