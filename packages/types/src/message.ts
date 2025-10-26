/** 用户数据 */
export interface IUserItem {
  id: string;
  name: string;
  avatar: string;
  fileResource: {
    id: string;
    fileName: string;
    filePath: string;
    bucketName: string;
    ossDomain: string;
    fullPath: string;
    createTime: string;
  } | null;
}
/** 消息数据 */
export interface IMessageItem {
  id: string;
  category: string; // 消息分类 1:系统消息 2:交流反馈
  subCategory: string; // 消息子类别 1:论文复现 2:项目复现
  subCategoryKey: string; // 论文/项目id
  title: string; // 论文/项目标题
  operType: string; // 操作类型 1:发起讨论;2:回复讨论;3:回复评论;4:讨论审核;5:评论审核;6:案例作者
  operContent: string; // 操作内容：评论内容、回复内容
  operKey: string; // 操作数据key，例如回复讨论是的被讨论话题id
  operUserId: string; // 操作人id
  users?: IUserItem[] | null; // 评论/点赞用户数据
  total?: number; // 收藏/点赞总数
  subTitle: string; // 子标题内容
  reading: string; // 阅读状态 1:未读 2:已读
  content: string; // 回复内容
  relationKey: string; // 消息通知关联的业务数据key，例如评论id
  createTime?: number; // 消息创建时间，毫秒级时间戳
  updateTime?: number; // 消息更新时间，

  source?: string /** 来源（0:后台添加 1:用户创建） */;
  auditResult?: string /** 审核结果（0:无状态  1待发布审核  2发布审核通过  3发布审核未通过  4平台取消发布 5平台发布（已发布下架之后上架） */;
}
/** 导航消息 */
export interface IMesageCenter {
  discuss: IMessageItem[];
  discussTotal: number;
  likes: IMessageItem[];
  likeTotal: number;
  systems: IMessageItem[];
  systemTotal: number;
}

export type MessageTabKey = 'discuss' | 'likes' | 'systems';
export type MessageTotalKey = 'discussTotal' | 'likeTotal' | 'systemTotal';

export enum EReadStatus {
  'unread' = '1',
  'read' = '2',
}

export const ESubCategory: { [key: string]: string } = {
  '1': '论文复现',
  '2': '项目复现',
};

export const EOperType: { [key: string]: string } = {
  '1': '发起了讨论',
  '2': '回复了我的讨论',
  '3': '回复了我的评论',
  '4': '您的讨论未通过审核',
  '5': '您的评论未通过审核',
  '6': '案例作者',
  '7': '赞了',
  '8': '收藏了',
};

export const ENavOperType: { [key: string]: string } = {
  '1': '讨论了',
  '2': '回复了',
  '3': '回复了',
  '4': '您的讨论未通过审核',
  '5': '您的评论未通过审核',
  '6': '案例作者',
  '7': '赞了',
  '8': '收藏了',
};

export enum EMachineType {
  'course' = '3',
  'paper' = '1',
  'project' = '2',
  'quick' = '4',
}
