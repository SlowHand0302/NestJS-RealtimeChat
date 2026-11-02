import {
    User as PrismaUser,
    Role as PrismaRole,
    Session as PrismaSession,
    Permission as PrismaPermission,
} from '@infrastructure/database/prisma/generated/client';
import { PrismaQuery, Subjects } from '@casl/prisma';
import { PureAbility } from '@casl/ability';
import { PermissionActionPropEnum as AppAction } from '@core/entities/permission.entity';

/**
 * Subject name -> Prisma model. Single place where CASL subjects are declared.
 */
export type AppSubjectModels = {
    UserSubject: PrismaUser;
    RoleSubject: PrismaRole;
    SessionSubject: PrismaSession;
    PermissionSubject: PrismaPermission;
};

export type AppSubjects = 'all' | Subjects<AppSubjectModels>;

export type AppAbility = PureAbility<[AppAction, AppSubjects], PrismaQuery>;

/**
 * Runtime list of the model-backed subject names ('all' is intentionally excluded).
 *
 * The registry below is typed as Record<keyof AppSubjectModels, true>, so the build fails
 * if a subject is added to AppSubjectModels but not listed here, or listed here but not
 * declared in AppSubjectModels.
 *
 * The value is true because it carries no information.
 * The registry exists only so the compiler can compare its keys with the type.
 * Object.keys(...) then turns those keys into the runtime array that @IsIn(...) needs.
 */
const APP_SUBJECT_REGISTRY: Record<keyof AppSubjectModels, true> = {
    UserSubject: true,
    RoleSubject: true,
    SessionSubject: true,
    PermissionSubject: true,
};

export const APP_SUBJECT_NAMES = Object.keys(APP_SUBJECT_REGISTRY) as (keyof AppSubjectModels)[];
