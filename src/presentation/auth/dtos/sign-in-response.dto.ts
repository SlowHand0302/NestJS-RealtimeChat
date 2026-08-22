import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '@infrastructure/database/prisma/generated/enums';

class SignInUserDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    emailVerified: boolean;

    @ApiProperty({ enum: UserStatus })
    status: UserStatus;

    @ApiProperty({ type: [String] })
    roles: string[];
}

class SignInTokensDto {
    @ApiProperty()
    accessToken: string;
    // refreshToken intentionally omitted — delivered via httpOnly cookie only
}

class SignInSessionDto {
    @ApiProperty()
    id: string;

    @ApiProperty({ type: Date })
    expiresAt: Date;
}

export class SignInResponseDto {
    @ApiProperty({ type: SignInUserDto })
    user: SignInUserDto;

    @ApiProperty({ type: SignInTokensDto })
    tokens: SignInTokensDto;

    @ApiProperty({ type: SignInSessionDto })
    session: SignInSessionDto;
}
