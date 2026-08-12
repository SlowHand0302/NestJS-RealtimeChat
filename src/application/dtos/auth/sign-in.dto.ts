import { UseCaseInput } from '@application/use-cases/_base.use-case';

export interface SignInDto extends UseCaseInput {
    email: string;
    password: string;
    clientDeviceId: string;
    deviceName?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
}
