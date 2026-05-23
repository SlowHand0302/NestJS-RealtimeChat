import { BaseValueObject } from './_base.vo';

export interface DeviceInfoProps {
    deviceId: string;
    deviceName?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
}

export class DeviceInfoVO extends BaseValueObject<DeviceInfoProps> {
    private constructor(props: DeviceInfoProps) {
        super(props);
    }

    public static create(props: DeviceInfoProps): DeviceInfoVO {
        this.validate(props);

        return new DeviceInfoVO({
            deviceId: props.deviceId.trim(),
            deviceName: props.deviceName?.trim() ?? null,
            ipAddress: props.ipAddress?.trim() ?? null,
            userAgent: props.userAgent?.trim() ?? null,
        });
    }

    /**
     * Reconstitute from persistence layer without strict validation.
     */
    public static reconstitute(props: DeviceInfoProps): DeviceInfoVO {
        return new DeviceInfoVO({
            deviceId: props.deviceId,
            deviceName: props.deviceName ?? null,
            ipAddress: props.ipAddress ?? null,
            userAgent: props.userAgent ?? null,
        });
    }

    private static validate(props: DeviceInfoProps): void {
        if (!props.deviceId || typeof props.deviceId !== 'string') {
            throw new Error('Device id is required');
        }

        if (props.deviceId.length > 255) {
            throw new Error('Device id is too long');
        }

        if (props.deviceName && props.deviceName.length > 255) {
            throw new Error('Device name is too long');
        }

        if (props.ipAddress && props.ipAddress.length > 255) {
            throw new Error('IP address is too long');
        }

        if (props.userAgent && props.userAgent.length > 2000) {
            throw new Error('User agent is too long');
        }
    }

    // Getters

    public get deviceId(): string {
        return this.props.deviceId;
    }

    public get deviceName(): string | null | undefined {
        return this.props.deviceName;
    }

    public get ipAddress(): string | null | undefined {
        return this.props.ipAddress;
    }

    public get userAgent(): string | null | undefined {
        return this.props.userAgent;
    }

    // Helpers

    public isSameDevice(device: DeviceInfoVO): boolean {
        return this.deviceId === device.deviceId;
    }

    public toJSON(): object {
        return {
            deviceId: this.deviceId,
            deviceName: this.deviceName,
            ipAddress: this.ipAddress,
            userAgent: this.userAgent,
        };
    }
}
