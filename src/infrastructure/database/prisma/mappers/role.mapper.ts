import {
    Role as PrismaRole,
    Permission as PrismaPermission,
    RolePermission as PrismaRolePermission,
} from '../generated/client';
import { PermissionMapper } from './permission.mapper';
import { Role as RoleEntity } from '@core/entities/role.entity';
import { IdentifierVO } from '@core/value-objects/identifier.vo';

type RoleWithPermission = PrismaRole & {
    rolePermissions: (PrismaRolePermission & { permission: PrismaPermission })[];
};

export class RoleMapper {
    static toDomain(prisma: RoleWithPermission): RoleEntity {
        const permissions = prisma.rolePermissions.map((prismaPermission) =>
            PermissionMapper.toDomain(prismaPermission.permission),
        );

        return RoleEntity.reconstitute(
            {
                name: prisma.name,
                permissions: permissions,
                description: prisma.description ?? undefined,
            },
            IdentifierVO.reconstitute(prisma.id),
            {
                createdAt: prisma.createdAt,
                updatedAt: prisma.updatedAt,
                deletedAt: prisma.deletedAt ?? undefined,
            },
        );
    }

    static toPersistence(role: RoleEntity) {
        return {
            id: role.id.value,
            name: role.name,
            description: role.description || null,
        };
    }
}
