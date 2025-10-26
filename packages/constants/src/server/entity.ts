export enum EScenarioType {
  // 模型训练
  TRAIN = 'TRAIN',
  // 数据处理
  PRE_PROCESS = 'PRE_PROCESS',
}

/**
 * 服务实体
 */
export interface IServerRuleEntity {
  id: string;
  createTime: string;
  ruleName: string;
  scenarioType: EScenarioType;
  cpu: number;
  mem: number;
  unit: string;
  unitPrice: number;
  updateTime: null;
  ruleSimpleName: string;
  count: number | null;
}

export enum EServerStatus {
  /**
   * 开机接口有60s 超时, 调用开机接口的状态，
   * (启动页面，但会自动打开资源弹框， 启动按钮显示loading 中，)
   * 这种情况的出现是，用户点了启动按钮，立马刷新浏览器
   *
   */
  OPENING = 'OPENING',
  /**
   * 开机中
   * (显示火速启动中的页面)
   */
  OPEN_PROCESS = 'OPEN_PROCESS', // getServerInfo OPEN_PROCESS
  /**
   * 开机成功
   * (结果页面)
   */
  OPEN_SUCCESS = 'OPEN_SUCCESS',
  /**
   * 关机成功
   * (启动页面)
   */
  CLOSE_SUCCESS = 'CLOSE_SUCCESS',
}

// OPEN_FAILED = 'OPEN_FAILED',
// OPEN_SUCCESS = 'OPEN_SUCCESS',
// CLOSE_PROCESS = 'CLOSE_PROCESS',
// CLOSE_FAILED = 'CLOSE_FAILED',

export interface IServerInstance {
  cpuCount: number;
  createTime: string;
  errorMessage: null;
  gpuCount: number;
  id: string;
  instanceData: string;
  instanceId: null | string;
  ruleName: string;
  scenarioType: string;
  serverRuleId: string;
  status: EServerStatus;
  updateTime: null;
  userId: string;
  openTime: string;
}

export enum EErrorCodeMap {
  LowBalance = 30016,
}
