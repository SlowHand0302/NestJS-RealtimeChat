/**
 * Resolves which SessionConcurrencyPolicy applies to a given user.
 *
 * This indirection exists so policy SELECTION (which rule applies to whom)
 * stays decoupled from policy EXECUTION (SessionConcurrencyPolicy.resolve()).
 *
 * Today: every user gets the same globally-bound policy (see
 * StaticSessionConcurrencyPolicyResolver) — single-device-per-user support
 * is backlog.
 *
 * Later: swapping to per-user selection (e.g. a stored preference on User/
 * UserProfile) means changing ONLY the bound implementation of this
 * interface. SessionManagerService and SignInUseCase never change, since
 * they only ever depend on this resolver, never on a concrete policy.
 */

import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { SessionConcurrencyPolicy } from './session-concurrency-policy.interface';

export const SESSION_CONCURRENCY_POLICY_RESOLVER = Symbol('SessionConcurrencyPolicyResolver');

export interface SessionConcurrencyPolicyResolver {
    resolvePolicyFor(userId: IdentifierVO): Promise<SessionConcurrencyPolicy>;
}
