import { PermissionActionPropEnum } from '@core/entities/permission.entity';
import { PolicyContext } from '../policy-context.interface';
import { IPolicyHandler } from '../policy-handler.interface';

export class CanManageSessionsPolicy implements IPolicyHandler {
    handle(context: PolicyContext): boolean {
        return context.ability.can(PermissionActionPropEnum.MANAGE, 'SessionSubject');
    }
}
