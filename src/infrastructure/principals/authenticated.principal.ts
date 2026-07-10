import { PermissionClaim } from '@core/interfaces/token-service.interface';

export interface AuthenticatedPrincipal {
    id: string;
    email: string;

    sessionId?: string;

    roles: readonly string[];
    permissions: readonly PermissionClaim[];
}
