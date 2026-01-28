import { AggregateRoot } from './_aggregate-root.interface';
import { EntityIdVO } from '@core/value-objects/entity-id.vo';
import { DeviceInfoVO } from '@core/value-objects/device-info.vo';

export enum SessionStrategyPropEnum {
    SINGLE_DEVICE = 'single_device',
    MULTI_DEVICE = 'multi_device',
}

interface SessionProps {
    userId: EntityIdVO;
    refreshToken: string;
    deviceInfo: DeviceInfoVO;
    isRevoke: boolean;
    expireAt: Date;
    lastUsedAt: Date;
}

export class Session extends AggregateRoot<SessionProps> {
    private constructor(
        props: SessionProps,
        id?: EntityIdVO,
        timestamp?: {
            createdAt?: Date;
            updatedAt?: Date;
            deletedAt?: Date;
        },
    ) {
        super(props, id, timestamp);
    }

    // Factory method for new session
    public static create(userId: EntityIdVO, refreshToken: string, expireAt: Date, deviceInfo: DeviceInfoVO) {
        const session = new Session({
            userId,
            refreshToken,
            expireAt,
            deviceInfo,
            isRevoke: false,
            lastUsedAt: new Date(),
        });
        return session;
    }

    // Factory method for reconstitution from persistence
    public static reconstitute(
        props: SessionProps,
        id?: EntityIdVO,
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
        return !this.props.isRevoke && new Date() < this.props.expireAt;
    }

    public isExpired(): boolean {
        return new Date() > this.props.expireAt;
    }

    public revoke(): void {
        if (this.props.isRevoke) {
            throw new Error('Session already revoked');
        }
        this.props.isRevoke = true;
        this.touch();
    }

    public rotate(newRefreshToken: string, newExpireAt: Date): void {
        if (!this.isValid()) {
            throw new Error('Cannot rotate invalid session');
        }
        this.props.refreshToken = newRefreshToken;
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

    // Getters
    get refreshToken(): string {
        return this.props.refreshToken;
    }

    get isRevoked(): boolean {
        return this.props.isRevoke;
    }

    get expiresAt(): Date {
        return this.props.expireAt;
    }

    get lastUsedAt(): Date {
        return this.props.lastUsedAt;
    }
}
