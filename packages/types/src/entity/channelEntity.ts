import { IBaseEntity } from './baseEntity';

/**
 * 渠道商实体
 */
export interface IChannelEntity extends IBaseEntity {
  channelId: string;
  channelName: string;
  phone: string;
  endDate: null;
  startDate: null;
  status: string;
  useAmount: number;
}
