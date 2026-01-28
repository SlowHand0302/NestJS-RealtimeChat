import { EntityIdVO } from '@core/value-objects/entity-id.vo';
import { IBaseRepository } from './_base.repository';
import { Session } from '@core/entities/session.entity';

export interface ISessionRepository extends IBaseRepository<Session> {
    findByRefreshToken(token: string): Promise<Session | null>;
    findActiveSessionsByUserId(userId: EntityIdVO): Promise<Session[]>;
    findByUserIdAndDeviceId(userId: EntityIdVO, deviceId: EntityIdVO): Promise<Session | null>;
    revokeById(id: EntityIdVO): Promise<void>;
    revokeAllByUserId(userId: EntityIdVO): Promise<void>;
    revokeAllByUserIdExcept(userId: EntityIdVO, sessionId: EntityIdVO): Promise<void>;
    deleteExpired(): Promise<void>;
}
