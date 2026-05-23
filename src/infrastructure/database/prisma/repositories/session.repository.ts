import { FilterCondition } from '@core/criteria/criteria';
import { Session } from '@core/entities/session.entity';
import { FilterOptions } from '@core/repositories/_base.repository';
import { ISessionRepository } from '@core/repositories/session.repository';
import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { PrismaService } from '../service/prisma.service';
import { SessionMapper } from '../mappers/session.mapper';
import { PrismaQueryMapper } from '../mappers/prisma-query.mapper';
import { Prisma } from '../generated/client';

export class SessionRepository implements ISessionRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(entity: Session): Promise<void> {
        const data = SessionMapper.toPersistence(entity);
        await this.prisma.session.create({
            data: data,
        });
    }

    async update(sessionId: IdentifierVO, entity: Session): Promise<void> {
        const data = SessionMapper.toPersistence(entity);
        await this.prisma.session.update({
            where: {
                id: sessionId.value,
            },
            data,
        });
    }

    async delete(id: IdentifierVO): Promise<void> {
        await this.prisma.session.delete({
            where: { id: id.value },
        });
    }

    async findByRefreshToken(token: string): Promise<Session | null> {
        const prismaSession = await this.prisma.session.findUnique({
            where: {
                refreshToken: token,
            },
        });
        return prismaSession ? SessionMapper.toDomain(prismaSession) : null;
    }

    async findActiveSessionsByUserId(userId: IdentifierVO): Promise<Session[]> {
        const prismaSessions = await this.prisma.session.findMany({
            where: {
                userId: userId.value,
                isRevoked: false,
                expiresAt: null,
            },
        });
        return prismaSessions.map((prismaSession) => SessionMapper.toDomain(prismaSession));
    }

    async findByUserIdAndDeviceId(userId: IdentifierVO, deviceId: string): Promise<Session | null> {
        const prismaSession = await this.prisma.session.findFirst({
            where: {
                userId: userId.value,
                deviceId: deviceId,
            },
        });
        return prismaSession ? SessionMapper.toDomain(prismaSession) : null;
    }

    async revokeById(id: IdentifierVO): Promise<void> {
        await this.prisma.session.update({
            where: {
                id: id.value,
            },
            data: {
                isRevoked: true,
            },
        });
    }

    async revokeAllByUserId(userId: IdentifierVO): Promise<void> {
        await this.prisma.session.updateMany({
            where: {
                userId: userId.value,
            },
            data: {
                isRevoked: true,
            },
        });
    }

    async revokeAllByUserIdExcept(userId: IdentifierVO, sessionId: IdentifierVO): Promise<void> {
        await this.prisma.session.updateMany({
            where: {
                userId: userId.value,
                id: {
                    not: sessionId.value,
                },
            },
            data: {
                isRevoked: true,
            },
        });
    }

    async deleteExpired(): Promise<void> {
        await this.prisma.session.deleteMany({
            where: {
                expiresAt: {
                    not: null,
                },
            },
        });
    }

    async findById(id: IdentifierVO): Promise<Session> {
        const prismaSession = await this.prisma.session.findUnique({
            where: {
                id: id.value,
            },
        });
        return prismaSession ? SessionMapper.toDomain(prismaSession) : null;
    }

    async findAll(options?: FilterOptions<Session, keyof Session>): Promise<Session[]> {
        const prismaWhere = PrismaQueryMapper.toPrismaWhere<Session, keyof Session, Prisma.SessionWhereInput>(
            options.filter,
        );
        const prismaSessions = await this.prisma.session.findMany({
            where: prismaWhere,
            take: options.take,
            skip: options.skip,
            // orderBy: options.orderBy
        });
        return prismaSessions.map((prismaSession) => SessionMapper.toDomain(prismaSession));
    }

    async findOne(condition?: FilterCondition<Session, keyof Session>): Promise<Session> {
        const prismaWhere = PrismaQueryMapper.toPrismaWhere<Session, keyof Session, Prisma.SessionWhereInput>(
            condition,
        );
        const prismaSession = await this.prisma.session.findFirst({
            where: prismaWhere,
        });
        return prismaSession ? SessionMapper.toDomain(prismaSession) : null;
    }

    async count(condition?: FilterCondition<Session, keyof Session>): Promise<number> {
        const prismaWhere = PrismaQueryMapper.toPrismaWhere<Session, keyof Session, Prisma.SessionWhereInput>(
            condition,
        );
        const count = await this.prisma.session.count({
            where: prismaWhere,
        });
        return count;
    }

    async exists(condition: FilterCondition<Session, keyof Session>): Promise<boolean> {
        const prismaWhere = PrismaQueryMapper.toPrismaWhere<Session, keyof Session, Prisma.SessionWhereInput>(
            condition,
        );
        const count = await this.prisma.session.count({
            where: prismaWhere,
        });
        return count > 0;
    }
}
