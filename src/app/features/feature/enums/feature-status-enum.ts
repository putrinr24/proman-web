export enum FeatureStatusEnum {
  DRAFT = 0,
  PROGRESS = 1,
  COMPLETED = 2,
  CANCELLED = 3,
}

export const getFeatureStatusEnumLabel = (featureStatusEnum: number) => {
  switch (featureStatusEnum) {
    case FeatureStatusEnum.DRAFT:
      return 'Draft';
    case FeatureStatusEnum.PROGRESS:
      return 'Progress';
    case FeatureStatusEnum.COMPLETED:
      return 'Completed';
    case FeatureStatusEnum.CANCELLED:
      return 'Cancelled';
    default:
      return 'Unknown';
  }
};

export const getFeatureStatusEnums = () => {
  const enums = Object.entries(FeatureStatusEnum);
  const result = [];

  for (const [key, value] of enums) {
    if (typeof value === 'number') {
      result.push({
        id: value,
        name: getFeatureStatusEnumLabel(+value),
      });
    }
  }

  return result;
};
