import { IResponsePage, ITaskPriceItem, ITuneItem } from '@llama-fa/types';

import { reqClient } from '@llama-fa/utils';

export interface IModelBaseInfo {
  /**
   * key
   */
  apiKey?: string;
  /**
   * 基模型id
   */
  baseServiceId?: string;
  /**
   * 模型参数量
   */
  chatTemplate?: string;
  /**
   * 创建时间
   */
  createTime: string;
  /**
   * 卡数
   */
  gpuNum?: number;
  id: string;
  /**
   * 是否是内置模型0是1否
   */
  isBaseModel?: number;
  /**
   * 删除状态：0未删 1已删
   */
  isDel?: number;
  /**
   * lora模型任务上限
   */
  maxLoraNum?: number;
  /**
   * 模型id
   */
  modelId?: string;
  /**
   * 模型名称
   */
  modelName?: string;
  /**
   * 模型参数量
   */
  modelSizeInBillion?: number;
  /**
   * 模型输出路径
   */
  modelSourcePath?: string;
  /**
   * 模型类型：vlm：llm：大语言模型用于：选择不同模型展示不同参数
   */
  modelType?: string;
  /**
   * 模型层数用于：当选择微调模式为freeze的时候，最大freeze_trainable_layers不能超过该值
   */
  numHiddenLayers?: number;
  /**
   * 模型内部名称
   */
  servedName?: string;
  /**
   * 模型对话链接
   */
  serviceUrl?: string;
  taskId?: string;
  /**
   * 修改时间
   */
  updateTime?: string;
  /**
   * 用户id
   */
  userId?: string;
  /**
   * worker数量
   */
  workers?: number;
  isMoe?: boolean;
  isLayer?: boolean;
}

export const modelBaseList = (params?: { pageNum: number; pageSize: number }) => {
  return reqClient.get<IResponsePage<IModelBaseInfo[]>>('/front/modelBase/list', { params });
};

export const dynamicPricing = (data: {
  predTotalTimeSec?: number;
  gpuCount: number;
  // 说现在微调不用传，评估传就行
  tuneType?: string;
  uniqueFlag?: string;
  isBaseModel?: ITuneItem['isBaseModel'];
  mergeModel?: ITuneItem['mergeModel'];
}) => {
  return reqClient.post<ITaskPriceItem[]>('/front/modelBase/dynamicPricing', data);
};

export const addModelFinetune = (data: any) => {
  return reqClient.post('/front/modelFineTune/add', data);
};

export const getModelFineTuneSwanLabUrl = async (taskId: string) => {
  const result = await reqClient.get<string>('/front/modelFineTune/getSwanLabUrl', {
    params: { id: taskId },
  });
  return result;
};

export interface IModelEstimatedTimeParams {
  /**
   * 序列长度。
   */
  cutoff_len: number;
  /**
   * 数据集名称，列表类型，没有后缀，如（datasets=["QA_from_CoVLA_zh", "QA_CoVLA_ShareGPT"]）
   */
  public_datasets: string[];
  /**
   * 数据集路径，列表类型，如（dataset_dirs=[
   * "/shared-only/datasets/AlayaNeW/QA_from_CoVLA_zh/data",
   * "/LLaMA-Factory/data"         ]）
   */
  private_datasets: string[];
  /**
   * 调优策略，可选 "lora", "full", 或 "freeze"。
   */
  finetuning_type: string;
  /**
   * 使用的GPU数量。
   */
  gpu_nums: number;
  /**
   * GPU类型（如 "a100", "h100" 等）。
   */
  gpu_type?: string;
  /**
   * 梯度累积步数。
   */
  gradient_accumulation_steps: number;
  /**
   * LoRA 的 alpha 值，默认为 16。
   */
  lora_alpha?: number;
  /**
   * LoRA 的秩，默认为 8。
   */
  lora_rank: number;
  /**
   * 梯度裁剪的最大范数，默认为 1.0。
   */
  max_grad_norm: number;
  /**
   * 最大样本数
   */
  max_samples?: number;
  /**
   * 混合精度设置，可选 "bf16", "fp16", "fp32", 或 "pure bf16"。
   */
  mixed_precision: string;
  /**
   * 模型名称，例如 "Qwen2.5-7B"。
   */
  model_name_or_path: string;
  /**
   * 模型大小，例如7
   */
  model_size_in_billion: number;
  /**
   * 训练轮数。1.0
   */
  num_train_epochs: number;
  /**
   * 是否打包，默认为false
   */
  packing?: boolean;
  /**
   * 批次大小。
   */
  per_device_train_batch_size: number;
  /**
   * 训练阶段（如 "sft"）。
   */
  stage: string;
  /**
   * 是否使用Flash Attention，默认为 False。
   */
  use_flash_attn?: boolean;
}

export interface IModelEstimatedTimeResult {
  predict_num_train_epochs: number;
  predict_packing_enabled: boolean;
  predict_packing_speedup_factor: any;
  predict_step_time_sec: number;
  predict_total_steps: number;
  predict_total_time_human: number;
  predict_total_time_human_max: number;
  predict_total_time_sec: number;
  predict_total_time_sec_max: number;
}

export const modelEstimatedTime = (data: Record<any, any>) => {
  return reqClient.post<IModelEstimatedTimeResult>('/front/modelBase/modelEstimatedTime', data);
};

export const modelEstimatedInferenceTime = (data: {}) => {
  return reqClient.post<IModelEstimatedTimeResult>(
    `/front/modelBase/modelEstimatedInferenceTime`,
    data
  );
};

// export const getFinetuneList = (params?: any) => {
//   return reqClient.get('/front/modelEvaluate/list', params);
// };

/**
 * 获取微调任务信息
 * @returns
 */
export const getFinetuneInfo = () => {
  return reqClient.get('/front/modelFineTune/getTuneAndEvaluateInfo');
};

export interface IModelTrainCalculatoParams {
  batch_size: number;
  model_size_in_billion: number;
  train_type: string;
}

export interface IModelTrainCalculatoResult {
  gpuNum: number;
  memoryUsage: number;
}

export const modelTrainCalculato = (params: IModelTrainCalculatoParams) => {
  return reqClient.post<IModelTrainCalculatoResult>('/front/modelBase/modelTrainCalculato', params);
};

export const modelReasoningCalculator = (params: { model_size_in_billion: number }) => {
  return reqClient.post<IModelTrainCalculatoResult>(
    '/front/modelBase/modelReasoningCalculator',
    params
  );
};

/**
 * 获取微调任务列表（用于下拉选择等场景）
 */
export interface IFinetuneTaskListParams {
  pageNum: number;
  pageSize: number;
  status?: any;
  taskName?: string;
  orderByColumn?: string | null;
  isAsc?: 'asc' | 'desc' | null;
}

export const getFineTuneList = (params: IFinetuneTaskListParams) => {
  return reqClient.get('/front/modelFineTune/list', { params });
};

export const checkModelAccount = (params: {
  estimatedPrice: any;
  tuneType?: string;
  taskId?: string;
  mergeModel?: boolean;
  isBaseModel?: number;
}) => {
  return reqClient.post('/front/modelBase/checkModelAccount', params, {
    extra: {
      hideErrorMessage: true,
    },
  });
};
