import { User } from '@core/entities/user.entity';
import { createPrismaAbility } from '@casl/prisma';
import { AppAbility, AppSubjects } from './casl-ability.types';
import { AbilityBuilder, ExtractSubjectType } from '@casl/ability';
import { PermissionClaim } from '@core/interfaces/token-service.interface';
import { AuthenticatedPrincipal } from '@infrastructure/principals/authenticated.principal';

export class CaslAbilityFactory {
    public createForPrincipal(principal: AuthenticatedPrincipal): AppAbility {
        return this.buildAbility(principal.permissions);
    }

    public createForUser(user: User) {
        const permissions = user.roles.flatMap((role) => role.permissions);
        return this.buildAbility(permissions);
    }

    private buildAbility(permissions: Iterable<PermissionClaim>): AppAbility {
        const { can, cannot, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);
        for (const permission of permissions) {
            const subject = permission.subject as Extract<AppSubjects, string>;
            if (permission.inverted) {
                cannot(
                    permission.action,
                    subject,
                    permission.fields ? [...permission.fields] : undefined,
                    permission.conditions,
                );
            } else {
                can(
                    permission.action,
                    subject,
                    permission.fields ? [...permission.fields] : undefined,
                    permission.conditions,
                );
            }
        }

        return build({
            detectSubjectType: (item) => item.constructor as unknown as ExtractSubjectType<AppSubjects>,
        });
    }

    /**
     * Resolves template variables in conditions.
     * e.g. { ownerId: '{{ user.id }}' } → { ownerId: '<actual-user-id>' }
     */
    // private resolveConditions(conditions: Record<string, unknown>, user: User): Record<string, unknown> {
    //     const resolved: Record<string, unknown> = {};
    //     for (const [key, value] of Object.entries(conditions)) {
    //         if (typeof value === 'string') {
    //             resolved[key] = value.replace(/\{\{\s*user\.(\w+)\s*\}\}/g, (_, field: string) => {
    //                 if (field === 'id') return user.id.value;
    //                 return String((user as unknown as Record<string, unknown>)[field] ?? '');
    //             });
    //         } else {
    //             resolved[key] = value;
    //         }
    //     }
    //     return resolved;
    // }
}
