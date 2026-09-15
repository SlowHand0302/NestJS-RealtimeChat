import { ApiProperty } from '@nestjs/swagger';

import { SessionResponseDto } from './session-response.dto';

export class AdminSessionResponseDto extends SessionResponseDto {
    @ApiProperty()
    userId: string;
}
