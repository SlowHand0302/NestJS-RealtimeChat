import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PlainPasswordVO } from '@core/value-objects/plain-password.vo';
import { HashedPasswordVO } from '@core/value-objects/hashed-password.vo';
import { IPasswordHasher } from '@core/interfaces/password-hasher.interface';

@Injectable()
export class BcryptPasswordHasher implements IPasswordHasher {
    private readonly saltRounds: number;

    constructor(private readonly configService: ConfigService) {
        this.saltRounds = this.configService.get<number>('BCRYPT_SALT_ROUNDS', 12);
    }

    async hash(plainPassword: PlainPasswordVO): Promise<HashedPasswordVO> {
        const hashed = await bcrypt.hash(plainPassword.value, this.saltRounds);
        return HashedPasswordVO.create(hashed);
    }

    async compare(plainPassword: PlainPasswordVO, hashedPassword: HashedPasswordVO): Promise<boolean> {
        return await bcrypt.compare(plainPassword.value, hashedPassword.value);
    }
}
