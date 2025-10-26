import { IServerInstance, IServerRuleEntity } from '@llama-fa/constants';

import { reqClient } from '@llama-fa/utils';

/**
 * 获取服务规格
 * @param params
 * @returns
 */
export const getServerRule = () => {
  return reqClient.get<IServerRuleEntity[]>('/front/server-rule/all');
};

export interface IOpenServerParams {
  serverRuleId: string;
  /**
   * 卡数
   */
  gpuCount?: number;
  cpuCount?: number;
  /**
   * 是否重置环境
   */
  resetEnv?: boolean;
}

/**
 * 开机
 * @returns
 */
export const openServer = (params: IOpenServerParams) => {
  return reqClient.post('/front/server-instance/open', params, {
    timeout: 1000 * 60 * 2.5,
  });
};

/**
 * 获取服务正在运行的实例
 * @returns
 */
export const getServerInstance = () => {
  // 使用reqClient.get方法，请求服务器实例的运行状态
  return reqClient.get<IServerInstance[]>('/front/server-instance/running');
};
/**
 * 获取最后一条服务实例
 * @returns
 */
export const getLastServerInfo = () => {
  // 使用reqClient.get方法，请求服务器实例的运行状态
  return reqClient.get<IServerInstance>('/front/server-instance/lastServerInfo');
};

/**
 * 关机
 * @param serverId
 * @returns
 */
export const closeServer = (serverId: string) => {
  return reqClient.put(
    '/front/server-instance/close',
    {
      serverId,
    },
    {
      // 超时设为2分半
      timeout: 1000 * 60 * 2.5,
    }
  );
};

export interface ITimeoutCloseServerInfo {
  createBy: string;
  createTime: string;
  updateBy: any;
  updateTime: any;
  remark: any;
  jobId: number;
  cronExpression: string;
  cronDate: string;
  status: string;
}

export const getJob = (serverId: string) => {
  return reqClient.get<ITimeoutCloseServerInfo>('/front/server-instance/getJob', {
    params: { serverId },
  });
};

export const addTimingShutdown = (data: {
  id: string;
  closeDate?: string;
  status?: string;
  jobId?: number;
}) => {
  return reqClient.post('/front/server-instance/addTimingShutdown', data);
};

export const diskUsage = () => {
  return reqClient.get<{ usage: string; quota: string }>('/front/server-instance/diskUsage');
};
