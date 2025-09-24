export enum DiscountTypeEnum {
  PERCENTAGE = 0,
  AMOUNT = 1,
}

export const getDiscountTypeEnumLabel = (discountTypeEnum: number | null) => {
  if (discountTypeEnum === null || discountTypeEnum === undefined) {
    return 'No Discount';
  }
  switch (discountTypeEnum) {
    case DiscountTypeEnum.PERCENTAGE:
      return 'Percentage';
    case DiscountTypeEnum.AMOUNT:
      return 'Amount';
    default:
      return 'Unknown';
  }
};

export const getDiscountTypeEnums = () => {
  const enums = Object.entries(DiscountTypeEnum);
  const result = [];

  for (const [key, value] of enums) {
    if (typeof value === 'number') {
      result.push({
        id: value,
        name: getDiscountTypeEnumLabel(+value),
      });
    }
  }

  return result;
};

export default DiscountTypeEnum;
