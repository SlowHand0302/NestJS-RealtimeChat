import { Injectable } from '@nestjs/common';
import { SessionConcurrencyPolicy, SessionSummary } from './session-concurrency-policy.interface';

/**
 * Default policy: no concurrency limit. A new sign-in never revokes any
 * existing session, on this device or any other.
 */
@Injectable()
export class UnlimitedSessionsPolicy implements SessionConcurrencyPolicy {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    resolve(existingSessions: SessionSummary[], newDeviceId: string): string[] {
        return [];
    }
}
