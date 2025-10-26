import { ITrainSchemaItem } from '@llama-fa/types';

export const transStringBoolean = (data: Record<any, any>): typeof data => {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => {
      if (value === 'True') {
        return [key, true];
      }
      if (value === 'False') {
        return [key, false];
      }

      return [key, value];
    })
  );
};

export const transBooleanString = (data: Record<any, any>): typeof data => {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => {
      if (value === true) {
        return [key, 'True'];
      }
      if (value === false) {
        return [key, 'False'];
      }

      return [key, value];
    })
  );
};

export const pickValueByLayouts = (layouts: ITrainSchemaItem[], data: Record<any, any>) => {
  const result: Record<any, any> = {};

  layouts.forEach((item) => {
    if (item.extraItemProps?.hidden) {
      return;
    }

    result[item.param_key] = data[item.param_key];
  });

  return result;
};
