import { IBaseEntity } from '@/entity/baseEntity';

export interface IDictItemEntity extends IBaseEntity {
  /**
   * 字典编码
   */
  dictCode: number;
  /**
   * 字典标签
   */
  dictLabel?: null | string;
  /**
   * 字典排序
   */
  dictSort?: number | null;
  /**
   * 字典类型
   */
  dictType?: null | string;
  /**
   * 字典键值
   */
  dictValue?: null | string;
  /**
   * 是否默认（Y是 N否）
   */
  isDefault?: null | string;
  /**
   * 表格回显样式
   */
  listClass?: null | string;
  /**
   * 备注
   */
  remark?: null | string;
  /**
   * 状态（0正常 1停用）
   */
  status?: null | string;
}
