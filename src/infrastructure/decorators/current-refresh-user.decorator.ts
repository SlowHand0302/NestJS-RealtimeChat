import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { RefreshAuthenticatedPrincipal } from '@infrastructure/principals/refresh-authenticated.principal';
import { RefreshAuthenticatedRequest } from '@infrastructure/http-requests/refresh-authenticated.request';

export const CurrentRefreshUser = createParamDecorator(
    (_: unknown, ctx: ExecutionContext): RefreshAuthenticatedPrincipal => {
        const request = ctx.switchToHttp().getRequest<RefreshAuthenticatedRequest>();

        return request.user;
    },
);
