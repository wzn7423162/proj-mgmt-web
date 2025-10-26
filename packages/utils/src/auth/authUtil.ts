import Cookies from 'js-cookie';
import { SESSION_STORAGE_PERSIST_SEARCH_PARAMS } from '@llama-fa/constants';
import { parseUrlByQueryParam } from '../utils/url';

export const TOKEN_KEY = `token`;

let toHomeWhenLogout = true;

const afterLogoutHandlers = new Set<(...args: any[]) => any>();

const hasSpaceOrSlash = (str: string) => {
  // 不允许空格和反斜杠
  if (/[\\ ]/.test(str)) {
    return true;
  }

  return false;
};

const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};
const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  afterLogoutHandlers.forEach((handler) => handler());
};

const isReqularPassword = (password: string) => {
  // 不允许空格和反斜杠
  if (hasSpaceOrSlash(password)) {
    return false;
  }

  if (password.length < 8 || password.length > 16) {
    return false;
  }

  const reg =
    /^(?=.*[a-zA-Z])(?=.*[0-9])|(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9])|(?=.*[0-9])(?=.*[^a-zA-Z0-9])[\s\S]$/;
  return reg.test(password);
};

const isReqularUserName = (password: string) => {
  // 不允许空格和反斜杠
  if (hasSpaceOrSlash(password)) {
    return false;
  }

  const reg = /^[a-zA-Z0-9]{4,12}$/;
  return reg.test(password.trim());
};

export const isRegularPhone = (value: number | string) => {
  const numberValue = typeof value === 'string' ? parseInt(value) : value;

  if (isNaN(numberValue) || numberValue.toString().length !== 11) {
    return false;
  }

  return true;
};

const afterLogout = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    // cookie 清除 auth_token
    Cookies.remove('auth_token');

    if (location.pathname !== '/' && toHomeWhenLogout) {
      const presistSearchParams = JSON.parse(
        sessionStorage.getItem(SESSION_STORAGE_PERSIST_SEARCH_PARAMS) || '{}'
      );

      // 修复：去掉多余的空格，正确拼接查询参数
      location.href = parseUrlByQueryParam('/login', presistSearchParams);
    }
  } catch (error: any) {
    console.error(error);
  }
};

export const injectAfterLogoutHandler = (handler: () => any) => {
  afterLogoutHandlers.add(handler);
};

export const ejectAfterLogoutHandler = (handler: () => any) => {
  afterLogoutHandlers.delete(handler);
};

export const AuthUtils = {
  updateToHomeWhenLogout: (value: boolean) => {
    toHomeWhenLogout = value;
  },
  getToken,
  setToken,
  clearToken,
  isReqularPassword,
  isReqularUserName,
  afterLogout,
  isRegularPhone,
};
