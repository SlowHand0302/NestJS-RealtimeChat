import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { JWT_ACCESS_STRATEGY } from '@infrastructure/config/passport.config';

@Injectable()
export class JwtAuthGuard extends AuthGuard(JWT_ACCESS_STRATEGY) {}
