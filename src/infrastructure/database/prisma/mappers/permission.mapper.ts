// implement mapper for permission, role and user entity
import { IdentifierVO } from '@core/value-objects/identifier.vo';
import { Permission as PrismaPermission } from '../generated/client';
import { PermissionActionPropEnum, Permission as PermissionEntity } from '@core/entities/permission.entity';

export class PermissionMapper {
    static toDomain(prisma: PrismaPermission): PermissionEntity {
        return PermissionEntity.reconstitute(
            {
                subject: prisma.subject,
                action: prisma.action as PermissionActionPropEnum,
                description: prisma.description ?? undefined,
                conditions: prisma.conditions ? (prisma.conditions as Record<string, unknown>) : undefined,
                fields: prisma.fields.length ? prisma.fields : undefined,
                inverted: prisma.inverted,
            },
            IdentifierVO.reconstitute(prisma.id),
            {
                createdAt: prisma.createdAt,
                updatedAt: prisma.updatedAt,
                deletedAt: prisma.deletedAt ?? undefined,
            },
        );
    }

    static toPersistence(permission: PermissionEntity) {
        return {
            id: permission.id.value,
            subject: permission.subject,
            action: permission.action,
            description: permission.description || null,
            fields: permission.isFieldScoped() ? permission.fields : [],
            conditions: permission.isConditional() ? permission.conditions : null,
            inverted: permission.inverted,
        };
    }
}
