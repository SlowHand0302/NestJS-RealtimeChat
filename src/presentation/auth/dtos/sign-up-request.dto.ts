import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignUpRequestDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string;

    // NOTE: MinLength(8) is a baseline API-layer guard only.
    // I haven't seen PlainPasswordVO's rules, so this may duplicate
    // or conflict with the domain's actual password policy.
    @ApiProperty({ example: 'StrongP@ssw0rd' })
    @IsString()
    @MinLength(8)
    password: string;
}
