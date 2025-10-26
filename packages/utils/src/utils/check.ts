const checkIsEmpty = (value: any) => value === '' || value === undefined || value === null;

export const findEmptyValueKey = (data: Record<any, any>) =>
  Object.entries(data).find(([key, value]) => checkIsEmpty(value));
