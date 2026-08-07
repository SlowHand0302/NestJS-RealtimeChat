import { Inject, Injectable } from '@nestjs/common';
import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { SessionConcurrencyPolicyResolver } from './session-concurrency-policy-resolver.interface';
import { SessionConcurrencyPolicy, SESSION_CONCURRENCY_POLICY } from './session-concurrency-policy.interface';

/**
 * Default resolver: ignores the user entirely, always returns the single
 * globally-bound SessionConcurrencyPolicy. This is today's scope — per-user
 * selection is a future resolver implementation, not a change to this file's
 * callers.
 */
@Injectable()
export class StaticSessionConcurrencyPolicyResolver implements SessionConcurrencyPolicyResolver {
    constructor(
        @Inject(SESSION_CONCURRENCY_POLICY)
        private readonly policy: SessionConcurrencyPolicy,
    ) {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async resolvePolicyFor(userId: IdentifierVO): Promise<SessionConcurrencyPolicy> {
        return this.policy;
    }
}
