import { BaseValueObject } from './_base.vo';

export interface DeviceIdentityProps {
    clientDeviceId: string;
    deviceName: string | null;
}

export class DeviceIdentityVO extends BaseValueObject<DeviceIdentityProps> {
    private constructor(props: DeviceIdentityProps) {
        super(props);
    }

    public static create(props: DeviceIdentityProps): DeviceIdentityVO {
        this.validate(props);

        return new DeviceIdentityVO({
            clientDeviceId: props.clientDeviceId.trim(),
            deviceName: props.deviceName?.trim() ?? null,
        });
    }

    public static reconstitute(props: DeviceIdentityProps): DeviceIdentityVO {
        return new DeviceIdentityVO({
            clientDeviceId: props.clientDeviceId,
            deviceName: props.deviceName ?? null,
        });
    }

    private static validate(props: DeviceIdentityProps): void {
        if (!props.clientDeviceId || typeof props.clientDeviceId !== 'string') {
            throw new Error('Client device id is required');
        }
        if (props.clientDeviceId.length > 255) {
            throw new Error('Client device id is too long');
        }
        if (props.deviceName && props.deviceName.length > 255) {
            throw new Error('Device name is too long');
        }
    }

    public get clientDeviceId(): string {
        return this.props.clientDeviceId;
    }

    public get deviceName(): string | null | undefined {
        return this.props.deviceName;
    }

    public isSameClientDevice(other: DeviceIdentityVO): boolean {
        return this.clientDeviceId === other.clientDeviceId;
    }

    public toJSON(): object {
        return { clientDeviceId: this.clientDeviceId, deviceName: this.deviceName };
    }
}
