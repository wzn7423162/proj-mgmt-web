import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'antd';

// 创建axios实例
const request = axios.create({
  baseURL: '/front',
  timeout: 30000,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;

    // 如果是下载文件等特殊情况，直接返回
    if (response.config.responseType === 'blob') {
      return response;
    }

    // 检查业务状态码
    if (res.code !== undefined && res.code !== 200) {
      message.error(res.msg || '请求失败');

      // 401表示未登录或token过期
      if (res.code === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }

      return Promise.reject(new Error(res.msg || '请求失败'));
    }

    return res;
  },
  (error) => {
    message.error(error.message || '网络请求失败');
    return Promise.reject(error);
  }
);

export default request;

// 封装常用的请求方法
export const get = <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return request.get(url, config);
};

export const post = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return request.post(url, data, config);
};

export const put = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return request.put(url, data, config);
};

export const del = <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return request.delete(url, config);
};

// 參照 online：帳號密碼登錄（服務端返回 { token }）
export const loginByName = (params: { phone: string; password: string }) => {
  return post<{ token: string }>('/login/loginByName', params);
};

