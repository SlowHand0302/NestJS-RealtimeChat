import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IRefreshTokenHasher } from '@core/interfaces/refresh-token-hasher.interface';

@Injectable()
export class BcryptRefreshTokenHasher implements IRefreshTokenHasher {
    private readonly saltRounds: number;

    constructor(private readonly configService: ConfigService) {
        this.saltRounds = this.configService.get<number>('BCRYPT_SALT_ROUNDS', 12);
    }

    async hash(plainRefreshToken: string): Promise<string> {
        return await bcrypt.hash(plainRefreshToken, this.saltRounds);
    }

    async compare(plainRefreshToken: string, hashedRefreshToken: string): Promise<boolean> {
        return await bcrypt.compare(plainRefreshToken, hashedRefreshToken);
    }
}
