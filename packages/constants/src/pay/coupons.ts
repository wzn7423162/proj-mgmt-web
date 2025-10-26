export interface ICouponConfig {
  couponName: string;
  displayAmount: number | undefined;
  effectiveDays: number;
}

export const presetData: { label: string; value: string; config: ICouponConfig }[] = [
  {
    label: '内测先锋代金券',
    value: 'preset1',
    config: {
      couponName: '内测先锋代金券',
      displayAmount: 300,
      effectiveDays: 30,
    },
  },
  {
    label: '全民找茬代金券',
    value: 'preset2',
    config: {
      couponName: '全民找茬代金券',
      displayAmount: 20,
      effectiveDays: 30,
    },
  },
  {
    label: '最佳实践代金券',
    value: 'preset3',
    config: {
      couponName: '最佳实践代金券',
      displayAmount: 1000,
      effectiveDays: 30,
    },
  },
  {
    label: '新用户注册有礼代金券',
    value: 'preset5',
    config: {
      couponName: '新用户注册有礼代金券',
      displayAmount: 30,
      effectiveDays: 30,
    },
  },
  {
    label: '新用户进群金喜代金券',
    value: 'preset6',
    config: {
      couponName: '新用户进群金喜代金券',
      displayAmount: 20,
      effectiveDays: 30,
    },
  },
  {
    label: '邀新注册奖励代金券',
    value: 'preset7',
    config: {
      couponName: '邀新注册奖励代金券',
      displayAmount: 10,
      effectiveDays: 365,
    },
  },
  {
    label: '邀新充值奖励代金券',
    value: 'preset8',
    config: {
      couponName: '邀新充值奖励代金券',
      displayAmount: 20,
      effectiveDays: 365,
    },
  },
  {
    label: '自定义',
    value: 'preset4',
    config: {
      couponName: '',
      displayAmount: undefined,
      effectiveDays: 30,
    },
  },
];
