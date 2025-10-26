import { EGroupByZhName, EGroupKey, ITrainSchemaItem } from '@llama-fa/types';

export interface IGroupByFinetuneItem {
  groupKey: string;
  groupName: string;
  items: ITrainSchemaItem[];
}
export const groupByFinetuneLayout = (layout: ITrainSchemaItem[]) => {
  const groupByResult: Record<string, IGroupByFinetuneItem> = {};

  layout.forEach((item) => {
    const groupKey = item.group_key as EGroupKey;

    if (!groupByResult[groupKey]) {
      groupByResult[groupKey] = {
        groupKey,
        groupName: EGroupByZhName[groupKey],
        items: [],
      };
    }

    groupByResult[groupKey].items.push(item);
  });

  const sortedResult: Record<string, IGroupByFinetuneItem> = {};

  Object.keys(EGroupKey).forEach((key) => {
    const targetResult = groupByResult[key];
    if (targetResult) {
      sortedResult[key] = targetResult;
    }
  });

  return sortedResult;
};
