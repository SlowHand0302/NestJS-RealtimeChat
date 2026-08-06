import { Injectable } from '@nestjs/common';
import { Prisma } from '../generated/client';
import { Device } from '@core/entities/device.entity';
import { DeviceMapper } from '../mappers/device.mapper';
import { FilterCondition } from '@core/criteria/criteria';
import { PrismaService } from '../service/prisma.service';
import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { PrismaQueryMapper } from '../mappers/prisma-query.mapper';
import { FilterOptions } from '@core/repositories/_base.repository';
import { IDeviceRepository } from '@core/repositories/device.repository';

@Injectable()
export class DeviceRepository implements IDeviceRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(entity: Device): Promise<void> {
        const data = DeviceMapper.toPersistence(entity);
        await this.prisma.device.create({
            data: data,
        });
    }

    async update(deviceId: IdentifierVO, entity: Device): Promise<void> {
        const data = DeviceMapper.toPersistence(entity);
        await this.prisma.device.update({
            where: {
                id: deviceId.value,
            },
            data,
        });
    }

    async findByUserIdAndClientDeviceId(userId: IdentifierVO, clientDeviceId: string): Promise<Device | null> {
        const prismaDevice = await this.prisma.device.findFirst({
            where: {
                userId: userId.value,
                clientDeviceId: clientDeviceId,
            },
        });
        return prismaDevice ? DeviceMapper.toDomain(prismaDevice) : null;
    }

    async findById(id: IdentifierVO): Promise<Device | null> {
        const prismaDevice = await this.prisma.device.findUnique({
            where: {
                id: id.value,
            },
        });
        return prismaDevice ? DeviceMapper.toDomain(prismaDevice) : null;
    }

    async findAll(options?: FilterOptions<Device, keyof Device>): Promise<Device[]> {
        const prismaWhere = PrismaQueryMapper.toPrismaWhere<Device, keyof Device, Prisma.DeviceWhereInput>(
            options.filter,
        );
        const prismaDevices = await this.prisma.device.findMany({
            where: prismaWhere,
            take: options.take,
            skip: options.skip,
        });
        return prismaDevices.map((prismaDevice) => DeviceMapper.toDomain(prismaDevice));
    }

    async findOne(condition?: FilterCondition<Device, keyof Device>): Promise<Device | null> {
        const prismaWhere = PrismaQueryMapper.toPrismaWhere<Device, keyof Device, Prisma.DeviceWhereInput>(condition);
        const prismaDevice = await this.prisma.device.findFirst({
            where: prismaWhere,
        });
        return prismaDevice ? DeviceMapper.toDomain(prismaDevice) : null;
    }

    async count(condition?: FilterCondition<Device, keyof Device>): Promise<number> {
        const prismaWhere = PrismaQueryMapper.toPrismaWhere<Device, keyof Device, Prisma.DeviceWhereInput>(condition);
        const count = await this.prisma.device.count({
            where: prismaWhere,
        });
        return count;
    }

    async exists(condition: FilterCondition<Device, keyof Device>): Promise<boolean> {
        const prismaWhere = PrismaQueryMapper.toPrismaWhere<Device, keyof Device, Prisma.DeviceWhereInput>(condition);
        const count = await this.prisma.device.count({
            where: prismaWhere,
        });
        return count > 0;
    }
}
