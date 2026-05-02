import { Injectable } from '@nestjs/common';
import { Prisma } from '../generated/client';
import { Role } from '@core/entities/role.entity';
import { RoleMapper } from '../mappers/role.mapper';
import { PrismaService } from '../service/prisma.service';
import { FilterCondition } from '@core/criteria/criteria';
import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { PrismaQueryMapper } from '../mappers/prisma-query.mapper';
import { FilterOptions } from '@core/repositories/_base.repository';
import { IRoleRepository } from '@core/repositories/role.repository';

export const roleWithRelations = {
    rolePermissions: { include: { permission: true } },
} as const;

export type RoleWithRelations = Prisma.RoleGetPayload<{
    include: typeof roleWithRelations;
}>;

@Injectable()
export class RoleRepository implements IRoleRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findByName(name: string): Promise<Role | null> {
        const prismaRole = await this.prisma.role.findUnique({
            where: { name: name },
            include: roleWithRelations,
        });
        return prismaRole ? RoleMapper.toDomain(prismaRole) : null;
    }

    async findByUserId(userId: IdentifierVO): Promise<Role[]> {
        const prismaRoles = await this.prisma.role.findMany({
            where: {
                userRoles: {
                    some: { userId: userId.value },
                },
                deletedAt: null,
            },
            include: roleWithRelations,
        });
        return prismaRoles.map((role) => RoleMapper.toDomain(role));
    }

    async assignRoleToUser(userId: IdentifierVO, roleId: IdentifierVO): Promise<void> {
        await this.prisma.userRole.create({
            data: {
                userId: userId.value,
                roleId: roleId.value,
            },
        });
    }

    async removeRoleFromUser(userId: IdentifierVO, roleId: IdentifierVO): Promise<void> {
        await this.prisma.userRole.delete({
            where: {
                userId_roleId: {
                    userId: userId.value,
                    roleId: roleId.value,
                },
            },
        });
    }

    async syncUserRoles(userId: string, roleIds: string[]): Promise<void> {
        await this.prisma.$transaction([
            // 1. Remove all current roles for this user
            this.prisma.userRole.deleteMany({
                where: { userId: userId },
            }),
            // 2. Add the new set of roles
            this.prisma.userRole.createMany({
                data: roleIds.map((id) => ({
                    userId: userId,
                    roleId: id,
                })),
            }),
        ]);
    }

    async findById(id: IdentifierVO): Promise<Role> {
        const prismaRole = await this.prisma.role.findUnique({
            where: { id: id.value },
            include: roleWithRelations,
        });
        return prismaRole ? RoleMapper.toDomain(prismaRole) : null;
    }

    async findAll(options?: FilterOptions<Role, keyof Role>): Promise<Role[]> {
        const prismaWhere = PrismaQueryMapper.toPrismaWhere<Role, keyof Role, Prisma.RoleWhereInput>(options.filter);
        const prismaRoles = await this.prisma.role.findMany({
            where: prismaWhere,
            take: options.take,
            skip: options.skip,
            // orderBy: options.orderBy,
            include: roleWithRelations,
        });
        return prismaRoles.length > 0 ? prismaRoles.map((prismaRole) => RoleMapper.toDomain(prismaRole)) : [];
    }

    async findOne(options?: FilterCondition<Role, keyof Role>): Promise<Role | null> {
        const prismaWhere = PrismaQueryMapper.toPrismaWhere<Role, keyof Role, Prisma.RoleWhereInput>(options);
        const prismaRole = await this.prisma.role.findFirst({
            where: prismaWhere,
            include: roleWithRelations,
        });
        return prismaRole ? RoleMapper.toDomain(prismaRole) : null;
    }

    async save(entity: Role): Promise<void> {
        const data = RoleMapper.toPersistence(entity);
        await this.prisma.role.upsert({
            where: { id: data.id },
            update: { ...data },
            create: { ...data },
        });
    }

    async create(entity: Role): Promise<void> {
        const data = RoleMapper.toPersistence(entity);
        await this.prisma.role.create({
            data,
        });
    }

    async createMany(entities: Role[]): Promise<void> {
        const data = entities.map((entity) => RoleMapper.toPersistence(entity));
        await this.prisma.role.createMany({
            data,
        });
    }

    async update(id: IdentifierVO, entity: Role): Promise<void> {
        const data = RoleMapper.toPersistence(entity);
        await this.prisma.role.update({
            where: { id: id.value },
            data,
        });
    }

    async updateMany(entities: Role[]): Promise<void> {
        const data = entities.map((entity) => RoleMapper.toPersistence(entity));
        await this.prisma.$transaction(
            data.map((entity) =>
                this.prisma.role.update({
                    where: { id: entity.id },
                    data: entity,
                }),
            ),
        );
    }

    async archive(id: IdentifierVO): Promise<void> {
        await this.prisma.role.update({
            where: { id: id.value },
            data: {
                deletedAt: new Date(),
            },
        });
    }

    async archiveMany(entities: Role[]): Promise<void> {
        const data = entities.map((entity) => RoleMapper.toPersistence(entity));
        await this.prisma.$transaction(
            data.map((entity) =>
                this.prisma.role.update({
                    where: { id: entity.id },
                    data: {
                        deletedAt: new Date(),
                    },
                }),
            ),
        );
    }

    async restore(id: IdentifierVO): Promise<void> {
        await this.prisma.role.update({
            where: { id: id.value },
            data: {
                deletedAt: null,
            },
        });
    }

    async restoreMany(entities: Role[]): Promise<void> {
        const data = entities.map((entity) => RoleMapper.toPersistence(entity));
        await this.prisma.$transaction(
            data.map((entity) =>
                this.prisma.role.update({
                    where: { id: entity.id },
                    data: {
                        deletedAt: null,
                    },
                }),
            ),
        );
    }

    async delete(id: IdentifierVO): Promise<void> {
        await this.prisma.role.delete({ where: { id: id.value } });
    }

    async deleteMany(ids: IdentifierVO[]): Promise<void> {
        await this.prisma.role.deleteMany({
            where: { id: { in: ids.map((id) => id.value) } },
        });
    }

    async count(where?: FilterCondition<Role, keyof Role>): Promise<number> {
        const prismaWhere = PrismaQueryMapper.toPrismaWhere<Role, keyof Role, Prisma.RoleWhereInput>(where);
        const count = await this.prisma.role.count({
            where: prismaWhere,
        });
        return count;
    }

    async exists(where: FilterCondition<Role, keyof Role>): Promise<boolean> {
        const prismaWhere = PrismaQueryMapper.toPrismaWhere<Role, keyof Role, Prisma.RoleWhereInput>(where);
        const count = await this.prisma.role.count({
            where: prismaWhere,
        });
        return count > 0;
    }
}
