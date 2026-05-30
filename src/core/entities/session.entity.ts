import { AggregateRoot } from './_aggregate-root.interface';
import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { DeviceInfoVO } from '@core/value-objects/device-info.vo';

export enum SessionStrategyPropEnum {
    SINGLE_DEVICE = 'single_device',
    MULTI_DEVICE = 'multi_device',
}

interface SessionProps {
    userId: IdentifierVO;
    refreshTokenHash: string;
    deviceInfo: DeviceInfoVO;
    isRevoked: boolean;
    expireAt: Date;
    lastUsedAt: Date;
}

export class Session extends AggregateRoot<SessionProps> {
    private constructor(
        props: SessionProps,
        id?: IdentifierVO,
        timestamp?: {
            createdAt?: Date;
            updatedAt?: Date;
            deletedAt?: Date;
        },
    ) {
        super(props, id, timestamp);
    }

    // Factory method for new session
    public static create(userId: IdentifierVO, expireAt: Date, deviceInfo: DeviceInfoVO) {
        const session = new Session({
            userId,
            refreshTokenHash: '',
            expireAt,
            deviceInfo,
            isRevoked: false,
            lastUsedAt: new Date(),
        });
        return session;
    }

    // Factory method for reconstitution from persistence
    public static reconstitute(
        props: SessionProps,
        id?: IdentifierVO,
        timestamp?: {
            createdAt?: Date;
            updatedAt?: Date;
            deletedAt?: Date;
        },
    ): Session {
        return new Session(props, id, timestamp);
    }

    // Business Methods
    public isValid(): boolean {
        return !this.props.isRevoked && new Date() < this.props.expireAt;
    }

    public isExpired(): boolean {
        return new Date() > this.props.expireAt;
    }

    public revoke(): void {
        if (this.props.isRevoked) {
            throw new Error('Session already revoked');
        }
        this.props.isRevoked = true;
        this.touch();
    }

    public rotate(newRefreshTokenHash: string, newExpireAt: Date): void {
        if (!this.isValid()) {
            throw new Error('Cannot rotate invalid session');
        }
        this.props.refreshTokenHash = newRefreshTokenHash;
        this.props.expireAt = newExpireAt;
        this.recordUsage();
    }

    public recordUsage(): void {
        this.props.lastUsedAt = new Date();
        this.touch();
    }

    public isSameDevice(other: DeviceInfoVO): boolean {
        return this.props.deviceInfo.equals(other);
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

    get refreshTokenHash(): string {
        return this.props.refreshTokenHash;
    }

    get isRevoked(): boolean {
        return this.props.isRevoked;
    }

    get expiresAt(): Date {
        return this.props.expireAt;
    }

    get lastUsedAt(): Date {
        return this.props.lastUsedAt;
    }

    get deviceInfo(): DeviceInfoVO {
        return this.props.deviceInfo;
    }
}
