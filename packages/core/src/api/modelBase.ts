import { reqClient } from '@llama-fa/utils';

export interface IModelBaseOverview {
  modelTalkCount: number; // 模型对话
  serverRunningCount: number; // 实例空间
  fineTuneRunningCount: number; // 微调运行中个数
  evaluateQueuingCount: number; // 评估排队中个数
  fineTuneQueuingCount: number; // 微调排队中个数
  evaluateRunningCount: number; // 评估运行中个数
}

export interface IServerData {
  cpuCount: number; // CPU核数
  gpuCount: number; // GPU卡数
}

export const getModelBaseOverview = () => {
  return reqClient.get<IModelBaseOverview>('/front/modelBase/overview', {
    params: {},
  });
};

export const getModelBaseServerCount = () => {
  return reqClient.get<IServerData>('/front/modelBase/serverCount', {
    params: {},
  });
};