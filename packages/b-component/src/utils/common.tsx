import { ITuneItem } from '@llama-fa/types';

/**
 * 判断Lora是否免费
 * @param tuneItem
 * @returns
 */
export const isBuiltLora = (tuneItem: ITuneItem) => {
  return tuneItem?.tuneType === 'lora' && !tuneItem.mergeModel;
};
/**
 * 判断是否合并模型
 * @param tuneItem
 * @returns
 */
export const isMergeModel = (tuneItem: ITuneItem) => {
  return tuneItem?.mergeModel === true;
};
