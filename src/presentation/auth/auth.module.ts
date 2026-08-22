import { ApplicationModule } from '@application/application.module';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';

@Module({
    imports: [ApplicationModule],
    controllers: [AuthController],
})
export class AuthModule {}
