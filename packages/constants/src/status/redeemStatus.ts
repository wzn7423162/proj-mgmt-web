export enum ERedeemStatus {
  Unredeemed = 0,
  Redeemed = 1,
  Expired = 2,
}

export const RedeemStatusMap = {
  [ERedeemStatus.Unredeemed]: { text: '未兑换', status: 'default' },
  [ERedeemStatus.Redeemed]: { text: '已兑换', status: 'success' },
  [ERedeemStatus.Expired]: { text: '已过期', status: 'error' },
};
