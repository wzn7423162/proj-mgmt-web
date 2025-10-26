import { IRequestPreHandler, IResponsePreHandler } from './types';

import { AuthUtils } from '@/auth/authUtil';

// token失效相关的code码
const TOKEN_ERROR_CODES = [401];

const SUCCESS_CODES = new Set([200, 1001]);

const getResDataCode = (res: any) => {
  return res?.data?.code;
};

export const baseURLBinder: IRequestPreHandler = (reqConfig) => {
  if (!reqConfig.baseURL) {
    const baseURL = (process.env.NODE_ENV === 'development' ? '/api' : '/') + (reqConfig.extra?.prefix || '');

    reqConfig.baseURL = baseURL.replace(/\/{2,}/g, '/');
  }
  return reqConfig;
};

export const tokenBinder: IRequestPreHandler = (reqConfig) => {
  const token = AuthUtils.getToken();

  if (token) {
    reqConfig.headers.FrontToken = `Bearer ${token}`;
  }

  return reqConfig;
};

export const tokenBinderBackend: IRequestPreHandler = (reqConfig) => {
  const token = AuthUtils.getToken();

  if (token) {
    reqConfig.headers.BackendToken = `Bearer ${token}`;
  }

  return reqConfig;
};

export const authCodeChecker: IResponsePreHandler = (responseError) => {
  const dataCode = getResDataCode(responseError);
  // 情况1: token失效, 应该退出
  if (TOKEN_ERROR_CODES.includes(dataCode)) {
    AuthUtils.afterLogout();
    return Promise.reject(responseError);
  }

  return responseError;
};

export const responseDataFormat: IResponsePreHandler = (response) => {

   const { config } = response;
  // 获取请求头的自定义属性x-response-intact
  const intact = config.headers["x-response-intact"];
  // 若 x-response-intact值有效则返回整个response
  if (intact) {
    return response;
  }

  const { data } = response;
  const dataCode = getResDataCode(response);

  if (!SUCCESS_CODES.has(dataCode)) {
    return Promise.reject(response);
  }

  return data?.data ?? null;
};

export const responseErrorDataFormat: IResponsePreHandler = (response) => {
  const { data } = response;

  return data?.data ?? data;
};
