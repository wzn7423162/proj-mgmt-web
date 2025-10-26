import type { FormItemProps } from 'antd';

export enum EDataType {
  'int' = 'int', // UI中的数字输入框
  'float' = 'float', // UI中的小数输入框
  'float2' = 'float2', // UI中的科学计数法输入框
  'string' = 'string', // UI中的输入框
  'string2' = 'string2', // UI中的输入框
  'boolean' = 'boolean', // UI中的Switch
  'enum' = 'enum', // UI中的下拉选择
}

export type TDataType = keyof typeof EDataType;

export enum ENumberRenderType {
  'slider' = 'slider',
}

export enum EEnumRenderType {
  'radio' = 'radio',
}

export enum EGroupKey {
  'ResourceConfig' = 'ResourceConfig',
  'MetaConfig' = 'MetaConfig',
  'BasicConfig' = 'BasicConfig',
  'TrainingConfig' = 'TrainingConfig',
  'AdvancedConfig' = 'AdvancedConfig',
  'TokenizationConfig' = 'TokenizationConfig',
  'EvalConfig' = 'EvalConfig',
  'Efficiency&PerformanceConfig' = 'Efficiency&PerformanceConfig',
  'DistributedConfig' = 'DistributedConfig',
  'DataParamConfig' = 'DataParamConfig',
  'LogConfig' = 'LogConfig',
  'LoRAConfig' = 'LoRAConfig',
  'FreezeConfig' = 'FreezeConfig',
  'RLHFConfig' = 'RLHFConfig',
  'MutilModelsConfig' = 'MutilModelsConfig',
  'GaloreConfig' = 'GaloreConfig',
  'ApolloConfig' = 'ApolloConfig',
  'BAdamConfig' = 'BAdamConfig',
  'SwanLabConfig' = 'SwanLabConfig',
  'FilesConfig' = 'FilesConfig',
  'OtherConfig' = 'OtherConfig',
  'ExtraConfig' = 'ExtraConfig',
  'PredictConfig' = 'PredictConfig',
}

export const EGroupByZhName: Record<EGroupKey, string> = {
  'ResourceConfig': '资源配置',
  'MetaConfig': 'cmd拼接参数，UI没显示',
  'BasicConfig': '基础配置',
  'TrainingConfig': '基础配置',
  'LoRAConfig': 'LoRA配置',
  'RLHFConfig': 'RLHF配置',
  'MutilModelsConfig': '多模态参数配置',
  'GaloreConfig': 'Galore参数配置',
  'ApolloConfig': 'Apollo参数配置',
  'BAdamConfig': 'BAdam参数配置',
  'SwanLabConfig': 'SwanLab 配置',
  'FilesConfig': '文件管理目录配置',
  'OtherConfig': '其它参数配置',
  'FreezeConfig': 'freeze参数配置',
  'ExtraConfig': '额外参数设置',
  'PredictConfig': '评估配置', //模型评估参数配置
  'DataParamConfig': '数据参数配置',
  'AdvancedConfig': '进阶配置',
  'TokenizationConfig': 'Tokenization配置',
  'EvalConfig': '评估配置',
  'Efficiency&PerformanceConfig': '效率与性能配置',
  'DistributedConfig': '分布式配置',
  'LogConfig': '日志配置',
};

export interface IEnumOption {
  name: string;
  value: string;
}

export enum EDependencyAction {
  'hidden' = 'hidden',
  'readonly' = 'readonly',
}

export enum EDependencyOprator {
  'eq' = 'eq',
  'neq' = 'neq',
  'in' = 'in',
  'not_in' = 'not_in',
}

export interface IEnumOption {
  name: string;
  value: string;
  only_in_expert?: boolean;
}

export interface ITrainDependencyItem {
  param_key: string;
  values: Array<any>;
  op: EDependencyOprator;
  action: EDependencyAction;
}

export interface ITrainSchemaItem {
  extraItemProps?: FormItemProps;
  extraFieldProps?: Record<any, any>;
  group_key: EGroupKey | string; // 分组key
  param_key: string; // cmd key
  en_name: string; // UI英文名
  zh_name: string; // UI显示中文名
  default_value?: string; // 默认值
  description?: string; // UI名称中的tips
  data_type: TDataType; // 数据类型
  number_render_type?: keyof typeof ENumberRenderType; // 如果有值，输入框会和Slider组合显示
  number_range?: {
    // 数字的验证
    min: number;
    max: number;
    steps?: number;
  };
  placeholder?: string;
  required?: boolean; // 是否必填
  valid_reg?: string; // 验证的正则
  enum_options?: Array<IEnumOption>; // 下拉框数据
  enum_render_type?: EEnumRenderType;
  value_as_cmd?: boolean; // 该参数的key不做为cmd拼接，value为cmd拼接的值
  is_quick?: boolean; // 是否在快速微调参数
  is_estimator?: boolean; //训练评估预估算时间配置
  readonly?: boolean;
  dependencies: Array<ITrainDependencyItem>;
}

export enum ETaskMode {
  'fast' = 1,
  'queue' = 2,
  // 'longQueue' = '3',
  'dynamic' = 3,
}

export enum EFinetuneMode {
  'quick' = 0,
  'professional' = 1,
}

export interface ITaskPriceItem {
  alreadyRunTime?: number;
  alreadyWaitTime?: number;
  appMode: ETaskMode;
  available?: number;
  gpuCount?: number;
  lastWaitTime?: number;
  maxWaitTime: number;
  minWaitTime: number;
  realUnitPrice: number;
  runTime?: number;
  showWaitTime?: number;
  taskId?: string;
  discount: string;
  optTarget?: string;
}
