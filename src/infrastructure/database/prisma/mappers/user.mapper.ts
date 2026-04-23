import { User as UserEntity, UserStatusPropEnums } from '@core/entities/user.entity';
import {
    User as PrismaUser,
    Role as PrismaRole,
    UserRole as PrismaUserRole,
    Permission as PrismaPermission,
    UserProfile as PrismaUserProfile,
    RolePermission as PrismaRolePermission,
} from '../generated/client';
import { EmailVO } from '@core/value-objects/email.vo';
import { PasswordVO } from '@core/value-objects/password.vo';
import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { RoleMapper } from './role.mapper';
import { Gender, UserDetailInfo } from '@core/value-objects/user-detail.vo';

type UserWithRelations = PrismaUser & {
    userRoles: (PrismaUserRole & {
        role: PrismaRole & {
            rolePermissions: (PrismaRolePermission & {
                permission: PrismaPermission;
            })[];
        };
    })[];
    profile: PrismaUserProfile;
};

export class UserMapper {
    static toDomain(prisma: UserWithRelations) {
        const roles = prisma.userRoles.map((prismaRole) => RoleMapper.toDomain(prismaRole.role));
        const profile = UserMapper.toUserDetailVO(prisma);

        return UserEntity.reconstitute(
            {
                email: EmailVO.reconstitute(prisma.email),
                password: PasswordVO.reconstitute(prisma.passwordHash),
                emailVerified: false,
                status: prisma.status as UserStatusPropEnums,
                roles: roles,
                profile: profile,
            },
            IdentifierVO.reconstitute(prisma.id),
            {
                createdAt: prisma.createdAt,
                updatedAt: prisma.updatedAt,
                deletedAt: prisma.deletedAt ?? undefined,
            },
        );
    }

    static toPersistence(user: UserEntity) {
        return {
            id: user.id.value,
            email: user.email.value,
            passwordHash: user.password.hash,
            emailVerified: user.emailVerified,
            status: user.status,
            profile: user.hasProfile() ? { ...user.profile.props, userId: user.id.value } : undefined,
        };
    }

    private static toUserDetailVO(prisma: UserWithRelations): UserDetailInfo | null {
        const hasAnyProfileData =
            prisma.profile.nickname ||
            prisma.profile.avatarUrl ||
            prisma.profile.gender ||
            prisma.profile.birthdate ||
            prisma.profile.fullname ||
            prisma.profile.phoneNumber;

        if (!hasAnyProfileData) return null;

        return UserDetailInfo.create({
            nickname: prisma.profile.nickname ?? undefined,
            avatarUrl: prisma.profile.avatarUrl ?? undefined,
            gender: (prisma.profile.gender as Gender) ?? undefined,
            birthdate: prisma.profile.birthdate ?? undefined,
            fullname: prisma.profile.fullname ?? undefined,
            phoneNumber: prisma.profile.phoneNumber ?? undefined,
        });
    }
}
