import { UserRoleEnum } from './enums/user-role-enum';

export const ADMIN_ROLES = [
  UserRoleEnum.OWNER,
];

export const PROJECT_MANAGEMENT_ROLES = [
  UserRoleEnum.OWNER,
  UserRoleEnum.PROJECT_MANAGER,
];

export const DEVELOPER_ROLES = [
  UserRoleEnum.DEVELOPER,
];

export const CUSTOMER_ROLES = [
  UserRoleEnum.CUSTOMER,
];