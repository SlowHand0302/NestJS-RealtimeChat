import { UseCaseOutput } from '@application/use-cases/_base.use-case';

export interface ActiveSessionWithUserResponseDto extends UseCaseOutput {
    id: string;
    userId: string;
    clientDeviceId: string | null;
    deviceName: string | null;
    ipAddress: string | null;
    userAgent: string | null;
    expiresAt: Date;
    lastUsedAt: Date;
    createdAt: Date;
}

export interface GetActiveSessionsOfAllUsersPaginatedResponseDto extends UseCaseOutput {
    items: ActiveSessionWithUserResponseDto[];
    total: number;
}
