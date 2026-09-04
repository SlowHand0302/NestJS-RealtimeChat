import { Module } from '@nestjs/common';
import { ApplicationModule } from '@application/application.module';
import { SelfSessionController } from './controllers/self-session.controller';

@Module({
    imports: [ApplicationModule],
    controllers: [SelfSessionController],
})
export class SessionModule {}
