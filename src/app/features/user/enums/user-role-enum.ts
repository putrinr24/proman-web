export enum UserRoleEnum {
  OWNER = 0,
  PROJECT_MANAGER = 1,
  DEVELOPER = 2,
  CUSTOMER = 3
}

export const getUserRoleEnumLabel = (taskStatusEnum: UserRoleEnum) => {
  switch (taskStatusEnum) {
    case UserRoleEnum.OWNER:
      return 'Owner';
    case UserRoleEnum.PROJECT_MANAGER:
      return 'Project Manager';
    case UserRoleEnum.DEVELOPER:
      return 'Developer';
    case UserRoleEnum.CUSTOMER:
      return 'Customer';
    default:
      return 'Unknown';
  }
};

export const getUserRoleEnums = () => {
  const enums = Object.entries(UserRoleEnum);
  const result = [];

  for (const [key, value] of enums) {
    if (typeof value === 'number') {
      result.push({
        id: value,
        name: getUserRoleEnumLabel(+value),
      });
    }
  }

  return result;
};