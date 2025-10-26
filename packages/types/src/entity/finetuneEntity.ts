export interface IFinetuneEntity {
  /**
   * 任务模式1极速尊享2延时惠享3长时省享4灵动超省5限时免费
   */
  appMode?: number;
  /**
   * 执行命令的参数
   */
  args?: string;
  /**
   * 基础模型路径
   */
  baseModelSourcePath?: string;
  /**
   * 执行命令
   */
  cmd?: string;
  /**
   * json参数
   */
  configJson?: string;
  /**
   * 只取value的值
   */
  configValueAsCmdKeysStr?: string;
  /**
   * 创建时间
   */
  createTime: string;
  /**
   * 数据加速 True False
   */
  dataAcceleration?: string;
  /**
   * 环境变量
   */
  env?: string;
  /**
   * 预估执行时间，单位s
   */
  estimatedTime?: number;
  /**
   * 文件管理数据集
   */
  fileData?: string;
  /**
   * 任务完成时间
   */
  finishTime?: string;
  /**
   * 第一次算出的价格
   */
  firstPredUnitPrice?: number;
  /**
   * 第一次算出的等待时间
   */
  firstPredWaitTime?: number;
  /**
   * 卡数量
   */
  gpuCount?: number;
  id: string;
  /**
   * 镜像名称
   */
  image?: string;
  /**
   * 删除状态：0未删 1已删
   */
  isDel?: number;
  /**
   * 任务运行的标签
   */
  labels?: string;
  /**
   * 最长等待时间，单位s
   */
  maxWaitTime?: number;
  /**
   * 是否合并模型 True False
   */
  mergeModel?: string;
  /**
   * 最小等待时间，单位s
   */
  minWaitTime?: number;
  /**
   * 模型参数量
   */
  modelParams?: number;
  /**
   * 模型输出路径
   */
  modelSourcePath?: string;
  /**
   * VKS namespace（user-task）
   */
  namespace?: string;
  /**
   * 微调参数0快速微调1专家微调
   */
  paramModel?: number;
  /**
   * 任务预计执行时间
   */
  predTotalTimeSec?: number;
  /**
   * 公共数据
   */
  publicData?: string;
  /**
   * PVC
   */
  pvcMounts?: string;
  /**
   * 实际单价
   */
  realUnitPrice?: number;
  /**
   * 入队时间
   */
  requestTime?: string;
  /**
   * 任务模式：普通队列 1/ 动态定价队列 2 / spot队列 3（可驱逐任务队列） 4：cpu队列和普通队列一致（1核2G）
   */
  schedulingType?: number;
  /**
   * 日志id
   */
  serverlessId?: string;
  /**
   * 资源Id
   */
  serverRuleId?: string;
  /**
   * 资源名称
   */
  serverRuleName?: string;
  /**
   * 开始调度时间
   */
  startTime?: string;
  /**
   * 任务状态1：排队中  2：启动中  3：运行中  4：运行完成 5：运行失败，6：已停止，7：创建中，8：停止中，9：停止失败
   */
  status?: number;
  /**
   * 停止时间
   */
  stopTime?: string;
  /**
   * PVC subPath
   */
  subPath?: string;
  /**
   * SwanLab链接
   */
  swanLab?: string;
  /**
   * 任务名称
   */
  taskName?: string;
  /**
   * 任务折扣
   */
  taskPrice?: number;
  /**
   * 任务类型（task（8张卡以内），group（大于8张卡）），默认值 task
   */
  taskType?: string;
  /**
   * 基模型id
   */
  templateId?: string;
  /**
   * 基模型名称
   */
  templateName?: string;
  /**
   * 训练方式
   */
  trainType?: string;
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
   * 验证集切分比例
   */
  verificationRatio?: string;
  /**
   * 代码的工作目录(/opt/workdir)
   */
  workDir?: string;
}
