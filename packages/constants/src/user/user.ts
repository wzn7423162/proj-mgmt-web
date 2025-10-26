export enum EUserType {
  'null' = '3',
  /**
   * 普通用户
   */
  'normal' = '1',
  /**
   * 代理用户
   */
  'agent' = '2',
}

/**
 * 用户类型数据
 */
export const USER_TYPE_DATA = [
  { label: '普通用户', value: EUserType.normal },
  { label: '代理商', value: EUserType.agent },
];

/**
 * 用户邀请者枚举数据
 */
export const USER_INVITE_DATA = [
  { label: '无', value: EUserType.null },
  { label: '普通用户', value: EUserType.normal },
  { label: '代理商', value: EUserType.agent },
];

// 0未校验1校验成功2校验失败
export enum SWAN_LAB_STATUS_TYPE {
  'unverified' = 0,
  'success' = 1,
  'error' = 2,
}

export const SWAN_LAB_STATUS_DATA = [
  { label: '未校验', value: SWAN_LAB_STATUS_TYPE.unverified, color: 'rgba(0,0,0,0.8)' },
  { label: '校验成功', value: SWAN_LAB_STATUS_TYPE.success, color: '#52C41A' },
  { label: '校验失败', value: SWAN_LAB_STATUS_TYPE.error, color: '#f50' },
];

export enum EUserRegisterPlatformType {
  'pcApp' = 'pcApp',
  'miniApp' = 'miniApp',
}
/**
 * 用户注册平台枚举数据
 */
export const USER_REGISTER_PLATFORM = [
  { label: 'pc端', value: EUserRegisterPlatformType.pcApp },
  { label: '小程序', value: EUserRegisterPlatformType.miniApp },
];