import { AxiosRequestConfig, AxiosResponse } from 'axios';

import { FetchQueryOptions } from '@tanstack/query-core';

export interface IRequestOptions extends AxiosRequestConfig {
  preventDuplicateRequest?: boolean; // 防止重复请求
  cancelPreviousRequest?: boolean; // 取消上一个请求
  onDebounceEnd?: Function; // 防抖模式结束后的回调
  flag?: any;
  extra?: { hideErrorMessage?: boolean; [key: string]: any };
  queryOptions?: Partial<FetchQueryOptions>;
  timeout?: number;
}

export interface IRequestInitOptions extends IRequestOptions {
  manualReady?: boolean;
}

export enum ERequestUseType {
  request = 'request',
  requestError = 'requestError',
  response = 'response',
  responseError = 'responseError',
}

export type HuobanRequestUserType = keyof typeof ERequestUseType;

export interface IRequestInterceptorHandler<T = any, V = any> {
  (value: T): V | Promise<V>;
}

export interface IRequestConfig
  extends AxiosRequestConfig,
    Omit<
      IRequestOptions,
      'preventDuplicateRequest' | 'cancelPreviousRequest' | 'onDebounceEnd' | 'flag'
    > {
  headers: {
    [key: string]: any;
  };
}

export interface IRequestPreHandler
  extends IRequestInterceptorHandler<IRequestConfig, IRequestConfig> {}

export interface IResponsePreHandler
  extends IRequestInterceptorHandler<
    AxiosResponse & { config: IRequestConfig },
    AxiosResponse & { config: IRequestConfig }
  > {}

export interface IRequestInterceptorOption {
  [ERequestUseType.request]?: IRequestPreHandler;
  [ERequestUseType.requestError]?: IRequestInterceptorHandler;
  [ERequestUseType.response]?: IResponsePreHandler;
  [ERequestUseType.responseError]?: IResponsePreHandler;
}

export interface HuobanFile {
  [key: string]: any;
}
