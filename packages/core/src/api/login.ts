import { encrypt } from '../utils';
import { reqClient } from '@llama-fa/utils';

export const loginByName = (params: { phone: string; password: string }) => {
  params.password = encrypt(params.password);

  return reqClient.post<{ token: string }>('/front/login/loginByName', params);
};

export const loginBySms = (params: {
  phone: string;
  smsCode: string;
  uuid: string;
  agentId?: string; //代理商id
  promoteId?: string; // 普通用户（邀请者）id
  utm_source?: string;
}) => {
  return reqClient.post<{ token: string }>('/front/login/loginBySms', params);
};

export const loginSmsCode = (params: { phone: string }) => {
  return reqClient.get<{ uuid: string }>('/front/login/loginSmsCode', {
    params,
  });
};

export const forgotSmsCode = (params: { phone: string }) => {
  return reqClient.get<{ uuid: string }>('/front/login/forgotSmsCode', { params });
};

export const forgotPassword = (params: {
  phone: string;
  smsCode: string;
  uuid: string;
  password: string;
}) => {
  params.password = encrypt(params.password);

  return reqClient.post<{ token: string }>('/front/login/forgotPassword', params);
};

export const loginAPI = {
  login: (data: { username: string; password: string }) => {
    return reqClient.post<{ token: string; }>('/front/login/loginByPd', data);
  },
};
