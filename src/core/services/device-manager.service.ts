import { Inject, Injectable } from '@nestjs/common';

import { Device } from '@core/entities/device.entity';
import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { DeviceIdentityVO } from '@core/value-objects/device-identity.vo';
import { IDeviceRepository, DEVICE_REPOSITORY } from '@core/repositories/device.repository';

/**
 * DeviceManagerService
 *
 * Owns the lifecycle of the Device aggregate, independent of Session.
 *
 * Responsibility boundary (SOLID — single responsibility, separate from
 * SessionManagerService):
 *   - This service answers "have we seen this device before?" and keeps
 *     Device identity/sighting data (firstSeenAt/lastSeenAt) up to date.
 *   - It does NOT know about refresh tokens, session expiry, or concurrency
 *     policy — that's SessionManagerService's job.
 *   - SignInUseCase orchestrates both services together; they don't call
 *     each other directly, keeping Device and Session as independently
 *     testable, independently swappable aggregates.
 */
@Injectable()
export class DeviceManagerService {
    constructor(
        @Inject(DEVICE_REPOSITORY)
        private readonly deviceRepository: IDeviceRepository,
    ) {}

    /**
     * Finds the Device matching (userId, clientDeviceId), or creates a new
     * one if this is the first time this device has been seen for this user.
     *
     * Returns `isNew: true` when a Device was just created — callers (e.g.
     * SignInUseCase) can use this signal to trigger a "new device" alert.
     */
    async resolveDevice(
        userId: IdentifierVO,
        clientDeviceId: string,
        deviceName?: string | null,
    ): Promise<{ device: Device; isNew: boolean }> {
        const identity = DeviceIdentityVO.create({ clientDeviceId, deviceName });
        const candidate = Device.create(userId, identity);

        return this.deviceRepository.upsertByUserIdAndClientDeviceId(candidate);
    }
}
