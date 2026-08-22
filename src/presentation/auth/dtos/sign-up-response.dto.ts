import { ApiProperty } from '@nestjs/swagger';
import { UserStatusPropEnums } from '@core/entities/user.entity';

class SignUpUserDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    emailVerified: boolean;

    @ApiProperty()
    status: UserStatusPropEnums;
}

export class SignUpResponseDto {
    @ApiProperty({ type: SignUpUserDto })
    user: SignUpUserDto;
}
