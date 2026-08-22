import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenResponseDto {
    @ApiProperty()
    accessToken: string;
    // refreshToken intentionally omitted — rotated cookie only
}
