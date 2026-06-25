import { DeviceInfoVO } from '@core/value-objects/device-info.vo';
import { UseCaseInput } from '@application/use-cases/_base.use-case';
import { SessionStrategyPropEnum } from '@core/entities/session.entity';

export interface SignInDto extends UseCaseInput {
    email: string;
    password: string;
    deviceInfo: DeviceInfoVO;
    strategy?: SessionStrategyPropEnum;
}
