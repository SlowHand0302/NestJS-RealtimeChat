import { PolicyContext } from '../policy-context.interface';
import { IPolicyHandler } from '../policy-handler.interface';
import { PermissionActionPropEnum } from '@core/entities/permission.entity';

export class CanReadSessionsPolicy implements IPolicyHandler {
    handle(context: PolicyContext): boolean {
        return context.ability.can(PermissionActionPropEnum.READ, 'SessionSubject');
    }
}
