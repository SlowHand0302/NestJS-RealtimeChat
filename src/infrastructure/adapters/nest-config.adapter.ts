import { ConfigService } from '@nestjs/config';
import { IConfigProvider } from '@core/interfaces/config-provider.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NestConfigAdapter implements IConfigProvider {
    constructor(private readonly configService: ConfigService) {}

    getRefreshTokenTtl(): string {
        return this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_EXPIRES_IN');
    }
}
