import { IModelCurrentStatusResponse, IResponsePage, ITuneItem } from '@llama-fa/types';

import { reqClient } from '@llama-fa/utils';

// 获取微调模型的列表
export const getTuneList = (params?: { pageNum: number; pageSize: number; taskName?: string }) => {
  return reqClient.get<IResponsePage<ITuneItem[]>>('/front/modelBase/tuneList', { params });
};

/**
 * 开启对话
 * @param params
 * @returns
 */
export const openModalTask = (params: {
  taskId: string;
  gpuCount: number;
  mergeModel?: boolean;
}) => {
  return reqClient.post('/front/modelTalk/add', params);
};

/**
 * 获取对话当前状态
 * @param params
 * @returns
 */
export const getModelCurrentStatus = () => {
  return reqClient.put<IModelCurrentStatusResponse>('/front/modelTalk/getModelCurrentStatus');
};

/**
 * 停止对话
 * @param params
 * @returns
 */
export const stopModelTask = (params: { id: string }) => {
  return reqClient.put('/front/modelTalk/stopModelTask', params);
};

/**
 * 更新会话状态
 * @returns
 */
export const uploadStatus = () => {
  return reqClient.put('/front/modelTalk/uploadStatus');
};
