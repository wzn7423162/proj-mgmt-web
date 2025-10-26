// 通用响应接口
export interface BaseResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * 基础元数据
 */
export interface IBaseMeta {
  /**
   * 编号
   */
  id: string;
  /**
   * 创建时间
   */
  createTime: number;
  /**
   * 修改时间
   */
  modifiedTime: number;

  createUser: string;

  updateUser: string;
}

export type OmitBaseMeta<T> = Omit<T, keyof IBaseMeta>;

export interface IQueryPageParams {
  pageNum?: number;
  pageSize?: number;
}
