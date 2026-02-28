import { IdentifierVO } from './identifier.vo';

export class DeviceInfoVO {
    constructor(
        public readonly deviceId: IdentifierVO,
        public readonly deviceName: string | null,
        public readonly ipAddress: string | null,
        public readonly userAgent: string | null,
    ) {
        if (!deviceId) {
            throw new Error('Device ID is required');
        }
    }

    equals(other: DeviceInfoVO): boolean {
        return this.deviceId === other.deviceId;
    }
}
