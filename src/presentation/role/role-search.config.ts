import { Role } from '@core/entities/role.entity';
import { SearchConfig } from '@infrastructure/pipes/search-config';

/**
 * Whitelist of what clients may filter and sort on in POST admin/roles/search.
 * id and permissions are intentionally absent: they cannot be filtered or sorted on.
 * Limits are left at DEFAULT_SEARCH_LIMITS.
 */
export const ROLE_SEARCH_CONFIG: SearchConfig<Role> = {
    fields: {
        name: { kind: 'string', sortable: true },
        description: { kind: 'string', nullable: true },
        createdAt: { kind: 'date', sortable: true },
        updatedAt: { kind: 'date', sortable: true },
        deletedAt: { kind: 'date', nullable: true },
    },
};
