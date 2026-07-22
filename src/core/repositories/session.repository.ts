import { IBaseRepository } from './_base.repository';
import { Session } from '@core/entities/session.entity';
import { IdentifierVO } from '@core/value-objects/identifier.vo';

export const SESSION_REPOSITORY = Symbol('ISessionRepository');

export interface ISessionRepository extends Pick<
    IBaseRepository<Session>,
    'findAll' | 'findById' | 'findOne' | 'count' | 'exists' | 'update' | 'delete' | 'create'
> {
    findByRefreshToken(token: string): Promise<Session | null>;
    findActiveSessionsByUserId(userId: IdentifierVO): Promise<Session[]>;
    findByUserIdAndDeviceId(userId: IdentifierVO, deviceId: string): Promise<Session | null>;
    revokeById(id: IdentifierVO): Promise<void>;
    revokeAllByUserId(userId: IdentifierVO): Promise<void>;
    revokeAllByUserIdExcept(userId: IdentifierVO, sessionId: IdentifierVO): Promise<void>;
    deleteExpired(): Promise<void>;
}
