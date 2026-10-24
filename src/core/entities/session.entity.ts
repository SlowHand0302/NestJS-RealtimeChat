import { AggregateRoot } from './_aggregate-root.interface';
import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { ConnectionInfoVO } from '@core/value-objects/connection-info.vo';

interface SessionProps {
    userId: IdentifierVO;
    deviceId: IdentifierVO;
    refreshTokenHash: string;
    connectionInfo: ConnectionInfoVO;
    isRevoked: boolean;
    expiresAt: Date;
    lastUsedAt: Date;
}

export class Session extends AggregateRoot<SessionProps> {
    private constructor(
        props: SessionProps,
        id?: IdentifierVO,
        timestamp?: { createdAt?: Date; updatedAt?: Date; deletedAt?: Date },
    ) {
        super(props, id, timestamp);
    }

    public static create(
        userId: IdentifierVO,
        deviceId: IdentifierVO,
        expiresAt: Date,
        connectionInfo: ConnectionInfoVO,
    ) {
        return new Session({
            userId,
            deviceId,
            refreshTokenHash: '',
            expiresAt,
            connectionInfo,
            isRevoked: false,
            lastUsedAt: new Date(),
        });
    }

    public static reconstitute(
        props: SessionProps,
        id?: IdentifierVO,
        timestamp?: { createdAt?: Date; updatedAt?: Date; deletedAt?: Date },
    ): Session {
        return new Session(props, id, timestamp);
    }

    // Business Methods
    public isValid(): boolean {
        return !this.props.isRevoked && new Date() < this.props.expiresAt;
    }

    public isExpired(): boolean {
        return new Date() > this.props.expiresAt;
    }

    public revoke(): void {
        if (this.props.isRevoked) {
            throw new Error('Session already revoked');
        }
        this.props.isRevoked = true;
        this.touch();
    }

    public rotate(newRefreshTokenHash: string, newexpiresAt: Date): void {
        if (!this.isValid()) {
            throw new Error('Cannot rotate invalid session');
        }
        this.props.refreshTokenHash = newRefreshTokenHash;
        this.props.expiresAt = newexpiresAt;
        this.recordUsage();
    }

    public recordUsage(): void {
        this.props.lastUsedAt = new Date();
        this.touch();
    }

    public assignRefreshTokenHash(refreshTokenHash: string): void {
        if (this.props.refreshTokenHash) {
            throw new Error('Refresh token already assigned');
        }
        this.props.refreshTokenHash = refreshTokenHash;
        this.touch();
    }

    // Getters
    get userId(): string {
        return this.props.userId.value;
    }

    get deviceId(): string {
        return this.props.deviceId.value;
    }

    get refreshTokenHash(): string {
        return this.props.refreshTokenHash;
    }

    get isRevoked(): boolean {
        return this.props.isRevoked;
    }

    get expiresAt(): Date {
        return this.props.expiresAt;
    }

    get lastUsedAt(): Date {
        return this.props.lastUsedAt;
    }

    get connectionInfo(): ConnectionInfoVO {
        return this.props.connectionInfo;
    }
}
