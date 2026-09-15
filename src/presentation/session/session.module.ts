import { Module } from '@nestjs/common';
import { CaslModule } from '@infrastructure/casl/casl.module';
import { ApplicationModule } from '@application/application.module';
import { SelfSessionController } from './controllers/self-session.controller';
import { AdminSessionController } from './controllers/admin-session.controller';

@Module({
    imports: [ApplicationModule, CaslModule],
    controllers: [SelfSessionController, AdminSessionController],
})
export class SessionModule {}
