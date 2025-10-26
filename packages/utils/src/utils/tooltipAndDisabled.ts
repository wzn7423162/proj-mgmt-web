export const IS_NOT_REASONING = 'GPT-OSS-20B微调后的LoRA模型不支持推理';
export const IS_NOT_INFER = 'Baicai Infer暂不支持此模型的基模型';
export const IS_NOT_LORA_PUBLISH = '仅支持发布LoRA模型，此类型模型不支持发布';
export const IS_NOT_LORA_INFER = '仅支持发布LoRA模型，此类型模型不支持推理';

export interface PublishButtonStateParams {
  tuneType?: any; // 枚举 EModelType 或字符串
  isInfer?: number | string | boolean;
  isReasoning?: number | string | boolean;
  desc?: string;
  isPublish?: boolean;
}

export interface PublishButtonStateResult {
  disabled: boolean;
  tooltip: string;
}

/**
 * 统一计算“模型发布/推理”按钮的禁用与提示逻辑
 * 优先级：非 LoRA > 不支持推理基模 > 未进行推理
 */
export function getPublishButtonState(params: PublishButtonStateParams): PublishButtonStateResult {
  const { tuneType, isInfer, isReasoning, desc, isPublish } = params || {};
  const tooltip = desc || '';
  const isLora = `${tuneType}`.toLowerCase() === 'lora';
  const notInfer = `${isInfer}` !== '1' && `${isInfer}`.toLowerCase() !== 'true';
  const notReason = `${isReasoning}` !== '1' && `${isReasoning}`.toLowerCase() !== 'true';

  if (!isLora) {
    return { disabled: true, tooltip: isPublish ? IS_NOT_LORA_PUBLISH : IS_NOT_LORA_INFER };
  }
  if (notReason) {
    return { disabled: true, tooltip: IS_NOT_REASONING };
  }
  if (notInfer) {
    return { disabled: true, tooltip: IS_NOT_INFER };
  }
  return { disabled: false, tooltip };
}

// 评估详情页：仅检查 LoRA 与是否支持推理（不考虑 isReasoning）
export interface EvaluateButtonStateParams {
  tuneType?: any;
  isInfer?: number | string | boolean;
  desc?: string;
  isPublish?: boolean;
}

export function getEvaluateButtonState(
  params: EvaluateButtonStateParams
): PublishButtonStateResult {
  const { tuneType, isInfer, desc, isPublish } = params || {};
  const isLora = `${tuneType}`.toLowerCase() === 'lora';
  const notInfer = `${isInfer}` !== '1' && `${isInfer}`.toLowerCase() !== 'true';
  const tooltip = desc || '';
  if (!isLora)
    return { disabled: true, tooltip: isPublish ? IS_NOT_LORA_PUBLISH : IS_NOT_LORA_INFER };
  if (notInfer) return { disabled: true, tooltip: IS_NOT_INFER };
  return { disabled: false, tooltip };
}
