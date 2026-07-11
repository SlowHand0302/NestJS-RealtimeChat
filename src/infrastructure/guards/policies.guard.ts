import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';

import { PolicyHandler } from '@infrastructure/casl/policy-handler.interface';
import { CaslAbilityFactory } from '@infrastructure/casl/casl-ability.factory';
import { VERIFY_POLICIES_KEY } from '@infrastructure/decorators/verify-policies.decorator';
import { AuthenticatedRequest } from '@infrastructure/http-requests/authenticated.request';
import { PolicyContext, RouteHandlerFn } from '@infrastructure/casl/policy-context.interface';

@Injectable()
export class PoliciesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly abilityFactory: CaslAbilityFactory,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const handlers = this.reflector.getAllAndOverride<PolicyHandler[]>(VERIFY_POLICIES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!handlers || handlers.length === 0) {
            return true;
        }
        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
        const principal = request.user;
        if (!principal) {
            throw new UnauthorizedException();
        }

        const ability = this.abilityFactory.createForPrincipal(principal);
        const policyContext: PolicyContext = {
            ability,
            principal,
            request,
            executionContext: context,
            handler: context.getHandler() as RouteHandlerFn,
            controller: context.getClass(),
        };
        for (const handler of handlers) {
            const result = await this.executePolicyHandler(handler, policyContext);

            if (!result) {
                throw new ForbiddenException('You do not have permission to perform this action.');
            }
        }

        return true;
    }

    private async executePolicyHandler(handler: PolicyHandler, context: PolicyContext): Promise<boolean> {
        if (typeof handler === 'function') {
            return handler(context);
        }

        return handler.handle(context);
    }
}
