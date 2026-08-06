import { AggregateRoot } from './_aggregate-root.interface';
import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { DeviceIdentityVO } from '@core/value-objects/device-identity.vo';

interface DeviceProps {
    userId: IdentifierVO;
    identity: DeviceIdentityVO;
    firstSeenAt: Date;
    lastSeenAt: Date;
}

export class Device extends AggregateRoot<DeviceProps> {
    private constructor(
        props: DeviceProps,
        id?: IdentifierVO,
        timestamp?: { createdAt?: Date; updatedAt?: Date; deletedAt?: Date },
    ) {
        super(props, id, timestamp);
    }

    public static create(userId: IdentifierVO, identity: DeviceIdentityVO): Device {
        const now = new Date();
        return new Device({ userId, identity, firstSeenAt: now, lastSeenAt: now });
    }

    public static reconstitute(
        props: DeviceProps,
        id?: IdentifierVO,
        timestamp?: { createdAt?: Date; updatedAt?: Date; deletedAt?: Date },
    ): Device {
        return new Device(props, id, timestamp);
    }

    // Business methods
    public recordSighting(): void {
        this.props.lastSeenAt = new Date();
        this.touch();
    }

    public isSameClientDevice(clientDeviceId: string): boolean {
        return this.props.identity.clientDeviceId === clientDeviceId;
    }

    // Getters
    get userId(): string {
        return this.props.userId.value;
    }

    get clientDeviceId(): string {
        return this.props.identity.clientDeviceId;
    }

    get deviceName(): string | null | undefined {
        return this.props.identity.deviceName;
    }

    get identity(): DeviceIdentityVO {
        return this.props.identity;
    }

    get firstSeenAt(): Date {
        return this.props.firstSeenAt;
    }

    get lastSeenAt(): Date {
        return this.props.lastSeenAt;
    }
}
