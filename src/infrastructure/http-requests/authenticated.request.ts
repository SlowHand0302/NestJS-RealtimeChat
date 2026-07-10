import { Request } from 'express';
import { AuthenticatedPrincipal } from '@infrastructure/principals/authenticated.principal';

export interface AuthenticatedRequest extends Request {
    user: AuthenticatedPrincipal;
}
