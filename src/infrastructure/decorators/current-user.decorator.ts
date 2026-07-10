import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest } from '@infrastructure/http-requests/authenticated.request';
import { AuthenticatedPrincipal } from '@infrastructure/principals/authenticated.principal';

export const CurrentUser = createParamDecorator((_: unknown, ctx: ExecutionContext): AuthenticatedPrincipal => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.user;
});
