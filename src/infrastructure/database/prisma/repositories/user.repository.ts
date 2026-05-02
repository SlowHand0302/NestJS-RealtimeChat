import { Injectable } from '@nestjs/common';
import { Prisma } from '../generated/client';
import { User } from '@core/entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';
import { EmailVO } from '@core/value-objects/email.vo';
import { PrismaService } from '../service/prisma.service';
import { FilterCondition } from '@core/criteria/criteria';
import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { PrismaQueryMapper } from '../mappers/prisma-query.mapper';
import { FilterOptions } from '@core/repositories/_base.repository';
import { IUserRepository } from '@core/repositories/user.repository';

export const userWithRelations = {
    userRoles: {
        include: {
            role: {
                include: {
                    rolePermissions: {
                        include: {
                            permission: true,
                        },
                    },
                },
            },
        },
    },
    profile: true,
} as const;

export type UserWithRelations = Prisma.UserGetPayload<{
    include: typeof userWithRelations;
}>;

@Injectable()
export class UserRepository implements IUserRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findByEmail(email: EmailVO): Promise<User | null> {
        const prismaUser = await this.prisma.user.findUnique({
            where: { email: email.value },
            include: userWithRelations,
        });
        return prismaUser ? UserMapper.toDomain(prismaUser) : null;
    }

    async existsByEmail(email: EmailVO): Promise<boolean> {
        const exists = await this.prisma.user.count({
            where: { email: email.value },
        });
        return exists > 0;
    }

    async findById(id: IdentifierVO): Promise<User | null> {
        const prismaUser = await this.prisma.user.findUnique({
            where: { id: id.value },
            include: userWithRelations,
        });
        return prismaUser ? UserMapper.toDomain(prismaUser) : null;
    }

    async findAll(options?: FilterOptions<User, keyof User>): Promise<User[]> {
        const prismaWhere = PrismaQueryMapper.toPrismaWhere<User, keyof User, Prisma.UserWhereInput>(options.filter);
        const prismaUsers = await this.prisma.user.findMany({
            where: prismaWhere,
            take: options.take,
            skip: options.skip,
            // orderBy: options.orderBy,
            include: userWithRelations,
        });
        return prismaUsers.length > 0 ? prismaUsers.map((prismaUser) => UserMapper.toDomain(prismaUser)) : [];
    }

    async findOne(where?: FilterCondition<User, keyof User>): Promise<User | null> {
        const prismaWhere = PrismaQueryMapper.toPrismaWhere<User, keyof User, Prisma.UserWhereInput>(where);
        const prismaUser = await this.prisma.user.findFirst({
            where: prismaWhere,
            include: userWithRelations,
        });
        return prismaUser ? UserMapper.toDomain(prismaUser) : null;
    }

    async save(entity: User): Promise<void> {
        const data = UserMapper.toPersistence(entity);
        await this.prisma.user.upsert({
            where: { id: data.id },
            update: {
                ...data,
                profile: {
                    upsert: {
                        where: { userId: data.id },
                        create: { ...data.profile },
                        update: { ...data.profile },
                    },
                },
            },
            create: {
                ...data,
                profile: {
                    create: {
                        ...data.profile,
                    },
                },
            },
            include: userWithRelations,
        });
    }

    async create(entity: User): Promise<void> {
        const data = UserMapper.toPersistence(entity);
        await this.prisma.user.create({
            data: {
                ...data,
                profile: {
                    create: { ...data.profile },
                },
            },
        });
    }

    async createMany(entities: User[]): Promise<void> {
        const data = entities.map((entity) => UserMapper.toPersistence(entity));
        await this.prisma.$transaction(
            data.map((item) =>
                this.prisma.user.create({
                    data: {
                        ...item,
                        profile: {
                            create: { ...item.profile },
                        },
                    },
                }),
            ),
        );
    }

    async update(id: IdentifierVO, entity: User): Promise<void> {
        const data = UserMapper.toPersistence(entity);
        await this.prisma.user.update({
            where: { id: id.value },
            data: {
                ...data,
                profile: {
                    update: {
                        where: { userId: data.id },
                        data: { ...data.profile },
                    },
                },
            },
        });
    }

    async updateMany(entities: User[]): Promise<void> {
        const data = entities.map((entity) => UserMapper.toPersistence(entity));
        await this.prisma.$transaction(
            data.map((entity) =>
                this.prisma.user.update({
                    where: { id: entity.id },
                    data: {
                        ...entity,
                        profile: {
                            update: {
                                where: { userId: entity.id },
                                data: { ...entity.profile },
                            },
                        },
                    },
                }),
            ),
        );
    }

    async archive(id: IdentifierVO): Promise<void> {
        await this.prisma.user.update({
            where: { id: id.value },
            data: {
                deletedAt: new Date(),
            },
        });
    }

    async archiveMany(entities: User[]): Promise<void> {
        const data = entities.map((entity) => UserMapper.toPersistence(entity));
        await this.prisma.$transaction(
            data.map((entity) =>
                this.prisma.user.update({
                    where: { id: entity.id },
                    data: {
                        deletedAt: new Date(),
                    },
                }),
            ),
        );
    }

    async restore(id: IdentifierVO): Promise<void> {
        await this.prisma.user.update({
            where: { id: id.value },
            data: {
                deletedAt: null,
            },
        });
    }

    async restoreMany(entities: User[]): Promise<void> {
        const data = entities.map((entity) => UserMapper.toPersistence(entity));
        await this.prisma.$transaction(
            data.map((entity) =>
                this.prisma.user.update({
                    where: { id: entity.id },
                    data: {
                        deletedAt: null,
                    },
                }),
            ),
        );
    }

    async delete(id: IdentifierVO): Promise<void> {
        await this.prisma.user.delete({ where: { id: id.value } });
    }

    async deleteMany(ids: IdentifierVO[]): Promise<void> {
        await this.prisma.user.deleteMany({
            where: { id: { in: ids.map((id) => id.value) } },
        });
    }

    async count(where?: FilterCondition<User, keyof User>): Promise<number> {
        const prismaWhere = PrismaQueryMapper.toPrismaWhere<User, keyof User, Prisma.UserWhereInput>(where);
        const count = await this.prisma.user.count({
            where: prismaWhere,
        });
        return count;
    }

    async exists(where: FilterCondition<User, keyof User>): Promise<boolean> {
        const prismaWhere = PrismaQueryMapper.toPrismaWhere<User, keyof User, Prisma.UserWhereInput>(where);
        const count = await this.prisma.user.count({
            where: prismaWhere,
        });
        return count > 0;
    }
}
