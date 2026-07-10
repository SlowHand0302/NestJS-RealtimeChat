import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { JWT_REFRESH_STRATEGY } from '@infrastructure/config/passport.config';

@Injectable()
export class JwtRefreshTokenGuard extends AuthGuard(JWT_REFRESH_STRATEGY) {}
