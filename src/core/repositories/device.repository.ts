import { IBaseRepository } from './_base.repository';
import { Device } from '@core/entities/device.entity';
import { IdentifierVO } from '@core/value-objects/identifier.vo';

export const DEVICE_REPOSITORY = Symbol('IDeviceRepository');

export interface IDeviceRepository extends Pick<
    IBaseRepository<Device>,
    'findAll' | 'findById' | 'findOne' | 'count' | 'exists' | 'update' | 'create'
> {
    findByUserIdAndClientDeviceId(userId: IdentifierVO, clientDeviceId: string): Promise<Device | null>;
    upsertByUserIdAndClientDeviceId(candidate: Device): Promise<{ device: Device; isNew: boolean }>;
}
