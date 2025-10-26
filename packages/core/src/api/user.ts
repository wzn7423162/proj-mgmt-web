import { IAccountDetail, IUserInfo } from '@llama-fa/types';

import { encrypt } from '../utils';
import { reqClient } from '@llama-fa/utils';
import { IBasePageResponse } from './common';

export const youmengUpload = (params?: { cookieId: string; userId: string; userKey: string }) => {
  return reqClient.get('/front/login/youmengUpload', {
    params,
    extra: {
      hideErrorMessage: true,
    },
  });
};

export const getUserInfo = () => {
  return reqClient.get<IUserInfo>('/front/user/getUserInfo', {
    extra: {
      hideErrorMessage: true,
    },
  });
};

export const editUserInfo = (data: { userName?: string; avatarIndex?: string }) => {
  return reqClient.put<IUserInfo>('/front/user/editUserName', data);
};

export const checkSwanLab = (data: { swanLabKey: string }) => {
  return reqClient.put('/front/user/checkSwanLab', data, {
    extra: { hideErrorMessage: true },
  });
};

export const logout = () => {
  return reqClient.get('/front/logout');
};

/**
 * 获取账户余额
 * @returns
 */
export const getAccountDetail = () => {
  return reqClient
    .get<IAccountDetail>('/front/user/account/detail', {
      extra: {
        hideErrorMessage: true,
      },
    })
    .then((data) => {
      if (data.couponBalanceAmount7Day === undefined) {
        data.couponBalanceAmount7Day = 0;
      }
      if (data.couponBalanceTotalAmount === undefined) {
        data.couponBalanceTotalAmount = 0;
      }

      return data;
    });
};
/**
 * 修改用户密码
 * @returns
 */
export const editPassWord = (data: {
  phone: string;
  smsCode: string;
  uuid: string;
  password: string;
}) => {
  data.password = encrypt(data.password);

  return reqClient.put('/front/user/editPassWord', data);
};

export interface IPromotionUser {
  /**
   * 注册时间
   */
  createTime: string;
  /**
   * 消费金额
   */
  expense: string;
  /**
   * 充值金额
   */
  income: string;
  /**
   * 手机号
   */
  phone: string;
  /**
   * 用户id
   */
  userId: string;
}

/**
 * 获取推广用户列表
 * @param params
 * @returns
 */
export const promotionUserList = (params: { startDate: string; endDate: string }) => {
  return new Promise<IBasePageResponse<IPromotionUser>>((resolve) => {
    resolve({
      list: [],
      total: 0,
    });
  });
  // return reqClient.get<IBasePageResponse<IPromotionUser>>('/front/user/promotion/list', {
  //   params,
  //   cancelPreviousRequest: true,
  // });
};

export interface IPromotionSummary {
  /**
   * 消费合计
   */
  expense: number;
  /**
   * 充值合计
   */
  income: number;
  /**
   * 用户数量
   */
  userCount: number;
}

/**
 * 获取推广用户列表
 * @returns
 */
export const getPromotionSummary = (params?: { startDate: string; endDate: string }) => {
  return reqClient.get<IPromotionSummary>('/front/user/promotion/summary', {
    params,
    cancelPreviousRequest: true,
  });
};

export interface IInviteInfo {
  /**
   * 总金额
   */
  totalAmt: string;

  /**
   * 邀请数量
   */
  inviteNum: number;

  /**
   * 已完成的人的个数
   */
  completedNum: number;

  userCoupon: {
    //邀请好友
    receiverUserPhone?: string;
    //充值奖励代金券
    couponName?: string;
    // 注册代金券
    id: string;
  }[];
}

export interface IUserApiKeyListAll {
  description: string;
  apiKey: string;
  id: string;
}

/**
 * 获取邀请信息
 * @returns
 */
export const getInviteInfo = () => {
  return reqClient.post<IInviteInfo>('/front/inviteCoupon/getInfo');
};

export const getUserKeyList = (params: any) => {
  return reqClient.get('/front/userKey/list', { params });
};

export const getUserApiKeyListAll = (params: any) => {
  return reqClient.get<IUserApiKeyListAll[]>('/front/userKey/listApiKey', { params });
};
