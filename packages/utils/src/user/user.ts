import { getQueryParam, getQueryParams } from '@llama-fa/utils';

export enum EInvitationType {
  /**
   * 推广代理
   */
  agentID = 'agentID',
  /**
   * 邀请有礼
   */
  promoteID = 'promoteID',
}

/**
 * 获取邀请链接
 * @param params
 * @returns
 */
export const getInvitationUrl = (params: { type: EInvitationType; userId: string }) => {
  const { type, userId } = params;
  return `${window.location.origin}/register?${type}=${userId}`;
};

export const getInvitationType = (url: string) => {
  const { agentID, promoteID } = EInvitationType;
  if (url.includes(agentID)) {
    return agentID;
  }
  if (url.includes(promoteID)) {
    return promoteID;
  }
  return '';
};

/**
 * 获取登录邀请参数
 * @returns
 */
export const getLoginInvitationParams = () => {
  const invitationType = getInvitationType(window.location.href);
  if (!invitationType) {
    return {};
  }
  const userId = getQueryParam(invitationType);
  if (invitationType === EInvitationType.agentID) {
    return {
      agentId: userId,
    };
  }
  if (invitationType === EInvitationType.promoteID) {
    return {
      promoteId: userId,
    };
  }
  return {};
};
