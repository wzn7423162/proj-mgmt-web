import { IFileResource } from './file';
import { IFileMeta } from './meta';

export interface IUserInfo {
  id: string;
  userId: string;
  avatarIndex: string;
  phone: string;
  createTime: number;
  password: string;
  status: string;
  updateTime: null;
  userName: string;
  isEnable: number; // 余额提醒是否开启 0不开启 1开启
  balanceAmountMin: number; // 余额提醒最小值
  currentIdentityType: string; // 1 为普通用户 2为代理商
  fileHost: string | undefined;
  filePort: string | undefined;
  fileResource?: IFileResource;
  filePassword: string | undefined;
  swanLabKey: string | null;
  swanLabName: string | null;
  swanLabStatus: number;
}

export enum ELoginType {
  'password' = 'password',
  'sms' = 'sms',
}

export interface IAccountDetail {
  balanceAmount: number;
  couponBalanceAmount7Day: number;
  couponBalanceTotalAmount: number;
  payCouponBalanceAmount7Day: number; // 支付代金券剩余额度
  activityCouponBalanceAmount7Day: number; // 活动代金券剩余额度
  totalRecharge: number; // 总充值
  totalCouponAmount: number; // 总优惠券
  totalOrder: number; // 总订单额度
}
