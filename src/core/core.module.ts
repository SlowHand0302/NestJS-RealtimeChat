import { Module } from '@nestjs/common';
import { SessionManagerService } from './services/session-manager.service';
import { DeviceManagerService } from './services/device-manager.service';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { SESSION_CONCURRENCY_POLICY } from './policies/session-concurrency-policy.interface';
import { UnlimitedSessionsPolicy } from './policies/unlimited-sessions.policy';
import { SESSION_CONCURRENCY_POLICY_RESOLVER } from './policies/session-concurrency-policy-resolver.interface';
import { StaticSessionConcurrencyPolicyResolver } from './policies/static-session-concurrency-policy.resolver';

@Module({
    imports: [InfrastructureModule],
    providers: [
        DeviceManagerService,
        SessionManagerService,
        {
            provide: SESSION_CONCURRENCY_POLICY,
            useClass: UnlimitedSessionsPolicy,
        },
        {
            provide: SESSION_CONCURRENCY_POLICY_RESOLVER,
            useClass: StaticSessionConcurrencyPolicyResolver,
        },
    ],
    exports: [SessionManagerService, DeviceManagerService],
})
export class CoreModule {}
