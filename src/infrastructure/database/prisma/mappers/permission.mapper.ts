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
            // The column is a required Json, so "no conditions" is stored as {} (the entity getter
            // already normalizes undefined to {}), never as null.
            conditions: permission.conditions,
            inverted: permission.inverted,
        };
    }
}
