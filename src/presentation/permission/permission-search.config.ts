import { Permission, PermissionActionPropEnum } from '@core/entities/permission.entity';
import { SearchConfig } from '@infrastructure/pipes/search-config';

/**
 * Whitelist of what clients may filter and sort on in POST admin/permissions/search.
 * id, fields and conditions are intentionally absent: they cannot be filtered or sorted on.
 * Limits are left at DEFAULT_SEARCH_LIMITS.
 */
export const PERMISSION_SEARCH_CONFIG: SearchConfig<Permission> = {
    fields: {
        subject: { kind: 'string', sortable: true },
        action: { kind: 'enum', values: Object.values(PermissionActionPropEnum), sortable: true },
        description: { kind: 'string', nullable: true },
        inverted: { kind: 'boolean' },
        createdAt: { kind: 'date', sortable: true },
        updatedAt: { kind: 'date', sortable: true },
        deletedAt: { kind: 'date', nullable: true },
    },
};
