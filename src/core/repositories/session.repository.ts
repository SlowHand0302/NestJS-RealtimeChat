import { IBaseRepository } from './_base.repository';
import { Session } from '@core/entities/session.entity';
import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { FilterOptions } from './_base.repository';

export const SESSION_REPOSITORY = Symbol('ISessionRepository');

export interface ISessionRepository extends Pick<
    IBaseRepository<Session>,
    'findAll' | 'findById' | 'findOne' | 'count' | 'exists' | 'update' | 'delete' | 'create'
> {
    findByRefreshToken(token: string): Promise<Session | null>;

    /**
     * Returns ALL active sessions for a user, unbounded.
     * Required by SessionConcurrencyPolicy — policy correctness depends on
     * seeing the complete set, so this overload must never be paginated.
     */
    findActiveSessionsByUserId(userId: IdentifierVO): Promise<Session[]>;

    /**
     * Returns active sessions for a user, paginated per the given options.
     * Use this for display purposes (e.g. GetActiveSessionUseCase) — never
     * for concurrency policy resolution.
     */
    findActiveSessionsByUserIdPaginated(
        userId: IdentifierVO,
        options: Pick<FilterOptions<Session, keyof Session>, 'take' | 'skip' | 'orderBy'>,
    ): Promise<Session[]>;

    revokeById(id: IdentifierVO): Promise<void>;
    revokeAllByUserId(userId: IdentifierVO): Promise<void>;
    revokeAllByUserIdExcept(userId: IdentifierVO, sessionId: IdentifierVO): Promise<void>;
    deleteExpired(): Promise<void>;
}
