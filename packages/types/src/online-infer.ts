import { ESceneType } from '@llama-fa/types';

/** 模型来源 */
export const ModelSourceOptions = [
  { label: '我的模型', value: 'DEV' },
  { label: 'LLaMA-Factory Online', value: 'ONLINE' },
];
export const ModelSourceText = {
  DEV: '我的模型',
  ONLINE: 'LLaMA-Factory Online',
};
/** 模型类型 */
export const ModelTypeOptions = [{ label: 'LoRA', value: 'lora' }];
/** 模型场景 */
export const ModelSceneOptions = [
  { label: '图片生成', value: ESceneType.image },
  { label: '文本生成', value: ESceneType.text },
];

export const ModelSceneText = {
  [ESceneType.image]: '图片生成',
  [ESceneType.text]: '文本生成',
};
