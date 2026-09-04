import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SessionModule } from './session/session.module';

@Module({
    imports: [AuthModule, UserModule, SessionModule],
})
export class PresentationModule {}
