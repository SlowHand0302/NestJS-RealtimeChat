import {
    User as PrismaUser,
    Role as PrismaRole,
    Permission as PrismaPermission,
} from '@infrastructure/database/prisma/generated/client';
import { PrismaQuery, Subjects } from '@casl/prisma';
import { PureAbility } from '@casl/ability';
import { PermissionActionPropEnum as AppAction } from '@core/entities/permission.entity';

export type AppSubjects =
    | 'all'
    | Subjects<{
          UserSubject: PrismaUser;
          RoleSubject: PrismaRole;
          PermissionSubject: PrismaPermission;
      }>;

export type AppAbility = PureAbility<[AppAction, AppSubjects], PrismaQuery>;
