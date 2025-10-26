import { ESceneType } from '../scene';
import { IBaseEntity } from '@/entity/baseEntity';

// 0/1 开关
export type BinaryFlag = 0 | 1;

// 上线状态：0 上线，1 下线
export type OnlineStatus = 0 | 1;

// 是否深度思考：'f' 否，'t' 是
export type DeepFlag = 'f' | 't';

// 创作许可范围（各项功能允许/禁止）
export interface ScopeCreative {
  /** 可 Baicai Infer 在线生图：0 否，1 是 */
  zxEnable: BinaryFlag;
  /** 可通过 Baicai Infer API 调用生图：0 否，1 是 */
  apiEnable: BinaryFlag;
  /** 允许融合：0 否，1 是（你提供的说明为“不可进行融合”，如果后端约定相反可调整命名或含义） */
  blendEnable: BinaryFlag;
  /** 允许下载生图：0 否，1 是 */
  downEnable: BinaryFlag;
}

// 模型实体
export interface IModelItemEntity extends IBaseEntity {
  /** 主键ID */
  id: string;
  /** 模型名称（当前用户唯一） */
  name: string;
  /** 模型图片 */
  modelImage?: string;

  /** 所属用户ID */
  userId: string;
  /** 模型展示ID */
  showId?: string;

  /** 基础模型名称 */
  baseModel: string;
  /** 基础模型id */
  baseModelId?: number;

  /** 模型文件路径，全局唯一 */
  modelPath: string;
  /** 模型文件来源路径 */
  modelSourcePath?: string;
  /** 来源 */
  modelSource?: string;

  /** 发布状态 */
  releasedStatus?: BinaryFlag;

  /** 场景：0 图片生成，1 AI 对话 */
  scene?: ESceneType.image | ESceneType.text;

  /** 模型类型 */
  modelType?: string;

  /** 标签（后端若为数组或逗号分隔字符串，请据实际调整） */
  label?: string;

  /** 是否开启触发词：0 否，1 是 */
  isTrigger?: BinaryFlag;
  /** 触发词 */
  trigger?: string;

  /** 训练轮数 */
  trainingCount?: number;

  /** 描述 */
  described?: string;

  /** 使用次数 */
  useCount?: number;

  /** 最新发布：0 否，1 是 */
  isNew?: BinaryFlag;

  /** 商业许可范围（若为枚举或 0/1 开关请据实际调整） */
  commercialCreative?: string;

  /** 创作许可范围 */
  scopeCreative?: ScopeCreative | null;

  /** 发布时间 */
  releasedTime?: string;
  /** 创建时间 */
  createdTime?: string;
  /** 更新时间 */
  updatedTime?: string;

  /** 用户名称 */
  userName?: string;
  /** 用户头像索引 */
  avatarIndex?: number;

  /** 模型上传状态：0 未上传，1 已上传 */
  modelUploadStatus?: BinaryFlag;

  /** 允许转销售模型或出售融合模型：0 否，1 是 */
  saleCreative?: string;

  /** 模型 URL */
  modelUrl?: string;

  /** 是否深度思考：'f' 否，'t' 是 */
  isDeep?: DeepFlag;

  /** 模型单价 */
  unitPrice?: number;

  /** 模型推理时长 */
  reasoningDuration?: number;

  /** 调用次数 */
  callCount?: number;

  /** 上线状态：0 上线，1 下线 */
  status?: OnlineStatus;

  /** 预估费用 */
  totalPrice?: number;

  modelParameter?: any;

  // 所属用户发布模型总数
  releasedTotal?: any;
  // 所属用户发布模型总调用次数
  callTotalCount?: any;
}
