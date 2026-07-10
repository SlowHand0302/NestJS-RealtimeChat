import { RefreshAuthenticatedPrincipal } from '@infrastructure/principals/refresh-authenticated.principal';

export interface RefreshAuthenticatedRequest extends Request {
    user: RefreshAuthenticatedPrincipal;
}
