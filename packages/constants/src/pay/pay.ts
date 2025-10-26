export enum EPayStatus {
  /*
   * 待支付
   */
  WAITING = 'WAITING',
  /*
   * 支付成功
   */
  SUCCESS = 'SUCCESS',
  /*
   * 已关闭
   */
  CLOSED = 'CLOSED',

  /*
   * 已退款
   */
  REFUND = 'REFUND',
}

export interface IPayOrderEntity {
  amount: number;
  buyerId: null;
  createTime: null;
  goodsId: string;
  goodsName: string;
  id: string;
  payChannel: string;
  payResult: null;
  qrCode: string;
  status: EPayStatus;
  tradeNo: string;
  updateTime: null;
  userId: string;
}

export const SelectPayData = [
  {
    label: '按量付费',
    value: 'used',
  },
];
