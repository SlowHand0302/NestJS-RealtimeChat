import { Request } from 'express';
import { ExecutionContext, Type } from '@nestjs/common';

import { AppAbility } from './casl-ability.types';
import { AuthenticatedPrincipal } from '@infrastructure/principals/authenticated.principal';

export type RouteHandlerFn = (...args: unknown[]) => unknown;

export interface PolicyContext {
    /**
     * CASL ability built from the authenticated principal.
     */
    ability: AppAbility;

    /**
     * Current authenticated user extracted from the access token.
     */
    principal: AuthenticatedPrincipal;

    /**
     * Current HTTP request.
     */
    request: Request;

    /**
     * Original NestJS execution context.
     */
    executionContext: ExecutionContext;

    /**
     * Current route handler.
     */
    handler: (...args: unknown[]) => unknown;

    /**
     * Current controller class.
     */
    controller: Type<unknown>;
}
