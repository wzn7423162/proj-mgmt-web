import { reqClient } from '@llama-fa/utils';

export interface IModelEvaluateAddParams {
  /**
   * 任务模式，1极速尊享2动态优惠3灵动超省4lora评估限时免费5lora对话限时免费
   */
  appMode: number;
  /**
   * json参数
   */
  configJson: Record<any, any>;
  /**
   * 预估执行时间，单位s
   */
  estimatedTime: number;
  /**
   * 卡数量
   */
  gpuCount: number;
  /**
   * 最长等待时间，单位s
   */
  maxWaitTime: number;
  /**
   * 最小等待时间
   */
  minWaitTime: number;
  /**
   * 预计执行时间
   */
  predTotalTimeSec: number;
  /**
   * 真实单价
   */
  realUnitPrice: number;
  /**
   * 微调id
   */
  taskId: string;
  /**
   * 任务折扣
   */
  taskPrice: string;
  [property: string]: any;
}

export const modelEvaluateAdd = (data: IModelEvaluateAddParams) => {
  return reqClient.post('/front/modelEvaluate/add', data);
};
