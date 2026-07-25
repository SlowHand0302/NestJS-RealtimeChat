import { Module } from '@nestjs/common';
import { SessionManagerService } from './services/session-manager.service';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';

@Module({
    imports: [InfrastructureModule],
    providers: [SessionManagerService],
    exports: [SessionManagerService],
})
export class CoreModule {}
