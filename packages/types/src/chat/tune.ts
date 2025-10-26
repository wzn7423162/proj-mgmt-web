export interface ITuneItem {
  // id: string;
  // taskName: string;
  // templateId: string;
  // templateName: string;
  // tuneType: string;

  /**
   * 是否是内置模型0是1否
   */
  chatTemplate?: string;

  isBaseModel: 0 | 1;
  gpuCount?: number;
  id: string;
  taskId: string;

  /**
   * 任务名称
   */
  taskName?: string;

  /**
   * 基模型id
   */
  templateId?: string;
  /**
   * 基模型名称
   */
  templateName?: string;

  /**
   * 微调类型
   */
  tuneType?: 'freeze' | 'lora';
  modelSizeInBillion: number;
  deepThinking?: boolean;

  /**
   * 是否是合并模型
   */
  mergeModel: boolean;
}

export interface IModelCurrentStatusResponse {
  /**
   * 对话key
   */
  apiKey?: string;
  /**
   * 任务模式1极速尊享2延时惠享3长时省享4灵动超省5限时免费
   */
  appMode?: number;
  /**
   * 后端服务, vllm / sglang
   */
  backend?: string;
  /**
   * 后端服务参数（可以传空数组[]）
   */
  backendArgs?: string;
  /**
   * 后端服务版本 如果backend是vllm就是0.9.0.1、如果是sglang就是0.4
   */
  backendVersion?: string;
  /**
   * 创建时间
   */
  createTime: string;
  /**
   * 创建lora的描述
   */
  description?: string;
  /**
   * 任务结束时间
   */
  finishTime?: string;
  /**
   * 卡数量
   */
  gpuCount?: number;
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
   * 模型路径
   */
  modelSourcePath?: string;
  /**
   * 创建lora的名称,要求：userkey+loraname（不能有大写）
   */
  name?: string;
  /**
   * VKS namespace
   */
  namespace?: string;
  /**
   * 任务模式：普通队列 1/ 动态定价队列 2 / spot队列 3（可驱逐任务队列） 4：cpu队列和普通队列一致（1核2G）
   */
  schedulingType?: number;
  /**
   * 创建lora的名称,要求：userkey+loraname（不能有大写）
   */
  servedName?: string;
  /**
   * 资源Id
   */
  serverRuleId?: string;
  /**
   * 资源名称
   */
  serverRuleName?: string;
  /**
   * 部署lora的serviceId
   */
  serviceId?: string;
  /**
   * 对话地址
   */
  serviceUrl?: string;
  /**
   * 任务开始时间
   */
  startTime?: string;
  /**
   * 任务状态1：排队中 2：启动中 3：运行中 4：停止中，5：已停止，6.启动失败，7：创建中
   */
  status?: number;
  /**
   * 任务停止时间
   */
  stopTime?: string;
  /**
   * 模型微调Id
   */
  taskId?: string;
  /**
   * 任务名称
   */
  taskName?: string;
  /**
   * 基础模型id
   */
  templateId?: string;
  /**
   * 基础模型名称
   */
  templateName?: string;
  /**
   * 微调模型id
   */
  tuneModelId?: string;
  /**
   * 微调模型名称
   */
  tuneModelName?: string;
  /**
   * 微调方法 Lora Freeze full
   */
  tuneType?: string;
  /**
   * 修改时间
   */
  updateTime?: string;
  /**
   * 用户Id
   */
  userId?: string;
  /**
   * 用户优先级系数
   */
  userLevel?: number;
  /**
   * work数量
   */
  workers?: string;

  /**
   * 是否是合并模型
   */
  mergeModel: boolean;
}
