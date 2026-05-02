import { Injectable } from '@nestjs/common';
import { Prisma } from '../generated/client';
import { FilterCondition } from '@core/criteria/criteria';
import { PrismaService } from '../service/prisma.service';
import { PermissionMapper } from '../mappers/permission.mapper';
import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { PrismaQueryMapper } from '../mappers/prisma-query.mapper';
import { FilterOptions } from '@core/repositories/_base.repository';
import { IPermissionRepository } from '@core/repositories/permission.repository';
import { PermissionActionPropEnum, Permission } from '@core/entities/permission.entity';

export const permissionWithRelations = {
    rolePermissions: true,
} as const;

export type PermissionWithRelations = Prisma.RoleGetPayload<{
    include: typeof permissionWithRelations;
}>;

@Injectable()
export class PermissionRepository implements IPermissionRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findByResourceAndAction(subject: string, action: PermissionActionPropEnum): Promise<Permission | null> {
        const prismaPermission = await this.prisma.permission.findUnique({
            where: {
                subject_action: {
                    subject: subject,
                    action: action,
                },
            },
        });
        return prismaPermission ? PermissionMapper.toDomain(prismaPermission) : null;
    }

    async findById(id: IdentifierVO): Promise<Permission | null> {
        const prismaPermission = await this.prisma.permission.findUnique({
            where: {
                id: id.value,
            },
        });
        return prismaPermission ? PermissionMapper.toDomain(prismaPermission) : null;
    }

    async findAll(options?: FilterOptions<Permission, keyof Permission>): Promise<Permission[]> {
        const prismaWhere = PrismaQueryMapper.toPrismaWhere<Permission, keyof Permission, Prisma.PermissionWhereInput>(
            options.filter,
        );
        const prismaPermissions = await this.prisma.permission.findMany({
            where: prismaWhere,
            take: options.take,
            skip: options.skip,
            // orderBy: options.orderBy,
        });
        return prismaPermissions.length > 0
            ? prismaPermissions.map((permission) => PermissionMapper.toDomain(permission))
            : [];
    }

    async findOne(where?: FilterCondition<Permission, keyof Permission>): Promise<Permission | null> {
        const prismaWhere = PrismaQueryMapper.toPrismaWhere<Permission, keyof Permission, Prisma.PermissionWhereInput>(
            where,
        );
        const prismaPermission = await this.prisma.permission.findFirst({
            where: prismaWhere,
        });
        return prismaPermission ? PermissionMapper.toDomain(prismaPermission) : null;
    }

    async save(entity: Permission): Promise<void> {
        const data = PermissionMapper.toPersistence(entity);
        await this.prisma.permission.upsert({
            where: { id: data.id },
            update: {
                ...data,
                conditions: data.conditions as Prisma.InputJsonValue,
            },
            create: {
                ...data,
                conditions: data.conditions as Prisma.InputJsonValue,
            },
        });
    }

    async create(entity: Permission): Promise<void> {
        const data = PermissionMapper.toPersistence(entity);
        await this.prisma.permission.create({
            data: {
                ...data,
                conditions: data.conditions as Prisma.InputJsonValue,
            },
        });
    }

    async createMany(entities: Permission[]): Promise<void> {
        const data = entities.map((entity) => PermissionMapper.toPersistence(entity));
        await this.prisma.permission.createMany({
            data: data.map((converting) => ({
                ...converting,
                conditions: converting.conditions as Prisma.InputJsonValue,
            })),
            skipDuplicates: true,
        });
    }

    async update(id: IdentifierVO, entity: Permission): Promise<void> {
        const data = PermissionMapper.toPersistence(entity);
        await this.prisma.permission.update({
            where: { id: id.value },
            data: {
                ...data,
                conditions: data.conditions as Prisma.InputJsonValue,
            },
        });
    }

    async updateMany(entities: Permission[]): Promise<void> {
        const data = entities.map((entity) => PermissionMapper.toPersistence(entity));

        await this.prisma.$transaction(
            data.map((entity) =>
                this.prisma.permission.update({
                    where: { id: entity.id },
                    data: {
                        ...entity,
                        conditions: entity.conditions as Prisma.InputJsonValue,
                    },
                }),
            ),
        );
    }

    async archive(id: IdentifierVO): Promise<void> {
        await this.prisma.permission.update({
            where: { id: id.value },
            data: {
                deletedAt: new Date(),
            },
        });
    }

    async archiveMany(entities: Permission[]): Promise<void> {
        const data = entities.map((entity) => PermissionMapper.toPersistence(entity));

        await this.prisma.$transaction(
            data.map((entity) =>
                this.prisma.permission.update({
                    where: { id: entity.id },
                    data: {
                        ...entity,
                        conditions: entity.conditions as Prisma.InputJsonValue,
                        deletedAt: new Date(),
                    },
                }),
            ),
        );
    }

    async restore(id: IdentifierVO): Promise<void> {
        await this.prisma.permission.update({
            where: { id: id.value },
            data: {
                deletedAt: null,
            },
        });
    }

    async restoreMany(entities: Permission[]): Promise<void> {
        const data = entities.map((entity) => PermissionMapper.toPersistence(entity));

        await this.prisma.$transaction(
            data.map((entity) =>
                this.prisma.permission.update({
                    where: { id: entity.id },
                    data: {
                        ...entity,
                        conditions: entity.conditions as Prisma.InputJsonValue,
                        deletedAt: null,
                    },
                }),
            ),
        );
    }

    async delete(id: IdentifierVO): Promise<void> {
        await this.prisma.permission.delete({
            where: { id: id.value },
        });
    }

    async deleteMany(ids: IdentifierVO[]): Promise<void> {
        await this.prisma.permission.deleteMany({
            where: {
                id: {
                    in: ids.map((id) => id.value),
                },
            },
        });
    }

    async count(where?: FilterCondition<Permission, keyof Permission>): Promise<number> {
        const prismaWhere = PrismaQueryMapper.toPrismaWhere<Permission, keyof Permission, Prisma.PermissionWhereInput>(
            where,
        );
        const count = await this.prisma.permission.count({
            where: prismaWhere,
        });
        return count;
    }

    async exists(where: FilterCondition<Permission, keyof Permission>): Promise<boolean> {
        const prismaWhere = PrismaQueryMapper.toPrismaWhere<Permission, keyof Permission, Prisma.PermissionWhereInput>(
            where,
        );
        const count = await this.prisma.permission.count({
            where: prismaWhere,
        });
        return count > 0;
    }
}
