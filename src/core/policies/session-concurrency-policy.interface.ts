/**
 * Governs what happens to a user's existing sessions when a new session
 * is being created (sign-in).
 *
 * Session concurrency (single-device / single-user / unlimited) is deliberately
 * NOT enforced as a DB constraint (see session.prisma — no @@unique([userId, deviceId])).
 * It lives here instead, as a swappable application-layer rule, so switching
 * strategies never requires touching the schema, entities, or repositories —
 * only the bound implementation of this interface.
 *
 * Current binding: UnlimitedSessionsPolicy (no-op — all concurrent sessions allowed).
 */

export const SESSION_CONCURRENCY_POLICY = Symbol('SessionConcurrencyPolicy');

export interface SessionSummary {
    sessionId: string;
    deviceId: string;
}

export interface SessionConcurrencyPolicy {
    /**
     * Given a user's currently active sessions and the device id of the
     * session about to be created, return the ids of sessions that must
     * be revoked to satisfy this policy's rule.
     *
     * Returning an empty array means no existing sessions are affected.
     */
    resolve(existingSessions: SessionSummary[], newDeviceId: string): string[];
}
