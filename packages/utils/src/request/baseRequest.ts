import {
  IRequestInitOptions,
  IRequestInterceptorHandler,
  IRequestInterceptorOption,
  IRequestOptions,
  IRequestPreHandler,
} from './types';
import axios, { AxiosInstance, AxiosRequestConfig, CancelTokenSource } from 'axios';
import { generatePromiseWrap, isObject, reduceAsyncFunction } from '@/utils/common';

import { noop } from 'lodash';
import { queryClient } from './tanstack/client';

const DEFAULT_REQUEST_FLAG = 'DEFAULT_REQUEST_FLAG';

function mergeOptions(
  option1?: IRequestOptions | never,
  option2?: IRequestOptions | never
): IRequestOptions {
  option1 = isObject(option1) ? option1 : {};
  option2 = isObject(option2) ? option2 : {};

  return { ...option1, ...option2 };
}

const DEFAULT_INIT_OPTIONS: IRequestInitOptions = {
  manualReady: false,
  preventDuplicateRequest: false,
  cancelPreviousRequest: false,
  onDebounceEnd: noop,
};

export function isAxiosCancel(error: any) {
  return axios.isCancel(error);
}

export class PowerfulRequest {
  protected options: IRequestInitOptions;
  protected axiosIns: AxiosInstance;
  protected initTask = generatePromiseWrap();

  // 所有请求和响应的拦截器函数存放，都使用Set数据
  protected requestPreHandlersSet = new Set<IRequestPreHandler>();
  protected requestErrorPreHandlersSet = new Set<IRequestInterceptorHandler>();
  protected responsePreHandlersSet = new Set<IRequestInterceptorHandler>();
  protected responseErrorPreHandlersSet = new Set<IRequestInterceptorHandler>();

  protected flagRegister = new Map<
    any,
    {
      // 节流触发的URL登记
      throttleRegisterSet: Set<any>;
      // 防抖触发的URL登记
      debounceRegisterMap: Map<string, CancelTokenSource>;
    }
  >();

  constructor(options: IRequestInitOptions = {}) {
    this.options = { ...DEFAULT_INIT_OPTIONS, ...options };
    this.axiosIns = axios.create(this.options);

    // 自行处理拦截器的逻辑，axios的拦截器无法再request和response中出错后接着调用requestError或responseError的拦截器逻辑
    this.axiosIns.interceptors.request.use(
      this.executeRequestPreHandler as any,
      this.executeRequestErrorPreHandler
    );
    this.axiosIns.interceptors.response.use(
      this.executeResponsePreHandler,
      this.executeResponseErrorPreHandler
    );

    // 如果不需要自行指定初始化结束标识，直接就调用initTask的resolve方法
    if (!this.options.manualReady) {
      this.initTask.resolve(undefined);
    }
  }

  ready() {
    return this.initTask.promise;
  }

  /**
   * @description 手动修改initTask的状态为resolve（request会等待initTask.resolve的执行后，再继续下一步，否则一直等待）
   * @memberof IRequest
   */
  initComplete() {
    this.initTask.resolve(undefined);
  }

  /**
   * @description 更新实例的options
   * @param {IRequestInitOptions} options
   * @memberof IRequest
   */
  updateOptions(options: IRequestInitOptions) {
    this.options = { ...this.options, ...options };
  }

  /**
   * @description 请求前的拦截器处理，按照添加拦截器的顺序执行函数。如果执行时出错，会执行executeRequestErrorPreHandler函数走一遍requestError的拦截器逻辑。
   * @protected
   * @param {AxiosRequestConfig} reqConfig
   * @memberof IRequest
   */
  protected executeRequestPreHandler = async (
    reqConfig: AxiosRequestConfig
  ): Promise<AxiosRequestConfig> => {
    try {
      if (!reqConfig.headers) {
        reqConfig.headers = {};
      }

      const iterator = this.requestPreHandlersSet.values();

      return await reduceAsyncFunction(iterator, reqConfig);
    } catch (error) {
      return await this.executeRequestErrorPreHandler(error);
    }
  };

  /**
   * @description 请求前出错的拦截器处理，按照添加拦截器的顺序执行函数。
   * @protected
   * @param {*} reqError
   * @memberof IRequest
   */
  protected executeRequestErrorPreHandler = async (reqError: any) => {
    try {
      const iterator = this.requestPreHandlersSet.values();

      reqError = await reduceAsyncFunction(iterator, reqError);
    } catch (error) {
      reqError = error;
    } finally {
      return Promise.reject(reqError);
    }
  };

  /**
   * @description 响应后的拦截器处理，按照添加拦截器的顺序执行函数。如果执行时出错，会执行executeResponseErrorPreHandler函数走一遍responseError的拦截器逻辑。
   * @protected
   * @param {*} response
   * @memberof IRequest
   */
  protected executeResponsePreHandler = async (response: any) => {
    try {
      const iterator = this.responsePreHandlersSet.values();

      return await reduceAsyncFunction(iterator, response);
    } catch (error) {
      return await this.executeResponseErrorPreHandler(error);
    }
  };

  /**
   * @description 响应后的拦截器处理，按照添加拦截器的顺序执行函数。
   * @protected
   * @param {*} responseError
   * @memberof IRequest
   */
  protected executeResponseErrorPreHandler = async (responseError: any) => {
    try {
      const iterator = this.responseErrorPreHandlersSet.values();

      responseError = await reduceAsyncFunction(iterator, responseError?.response ?? responseError);
    } catch (error) {
      responseError = error;
    } finally {
      return Promise.reject(responseError);
    }
  };

  /**
   * @description 登记request/response的拦截器
   * @param {IRequestInterceptorOption} interceptorOption
   * @memberof IRequest
   */
  use(interceptorOption: IRequestInterceptorOption) {
    const { request, requestError, response, responseError } = interceptorOption;

    request && this.requestPreHandlersSet.add(request);
    requestError && this.requestErrorPreHandlersSet.add(requestError);
    response && this.responsePreHandlersSet.add(response);
    responseError && this.responseErrorPreHandlersSet.add(responseError);
  }

  /**
   * @description 解绑登记的拦截器，会在四个set中都卸载
   * @param {IRequestInterceptorHandler} handler
   * @memberof IRequest
   */
  eject(handler: IRequestInterceptorHandler) {
    this.requestPreHandlersSet.delete(handler);
    this.requestErrorPreHandlersSet.delete(handler);
    this.responsePreHandlersSet.delete(handler);
    this.responseErrorPreHandlersSet.delete(handler);
  }

  async request<T = any>(reqOptions: IRequestOptions): Promise<T> {
    await this.ready();

    const validOptions: IRequestOptions = mergeOptions(this.options, reqOptions);
    const {
      preventDuplicateRequest,
      cancelPreviousRequest,
      onDebounceEnd,
      flag = DEFAULT_REQUEST_FLAG,
      queryOptions,
      ...axiosConfig
    } = validOptions;

    const regisId = `${axiosConfig?.method}-${axiosConfig?.url}`;
    const flagInfo = this.flagRegister?.get(flag);

    if (preventDuplicateRequest) {
      // 如果节流模式，同method和同url，同一时间内只会保留一个请求
      if (flagInfo?.throttleRegisterSet.has(regisId)) {
        return Promise.reject(`${regisId}请求被节流模式中断`);
      }

      flagInfo?.throttleRegisterSet.add(regisId);
    }

    if (cancelPreviousRequest) {
      // 如果防抖模式,同method和同url,会尝试取消掉上次的相同请求
      if (flagInfo?.debounceRegisterMap.has(regisId)) {
        const cacheCancelRequest = flagInfo?.debounceRegisterMap.get(regisId);
        cacheCancelRequest?.cancel(`flag <${flag}>: ${regisId} ---- 请求被防抖模式中断`);
      }

      const requestCancelSource = axios.CancelToken.source();
      axiosConfig.cancelToken = requestCancelSource.token;
      flagInfo?.debounceRegisterMap.set(regisId, requestCancelSource);
    }

    const requestFn = async () => await this.axiosIns(axiosConfig);

    try {
      const paramsKey =
        axiosConfig.params
          ? typeof axiosConfig.paramsSerializer === 'function'
            ? axiosConfig.paramsSerializer(axiosConfig.params)
            : JSON.stringify(axiosConfig.params)
          : null;

      const res = await queryClient.fetchQuery({
        queryKey: [axiosConfig.method, axiosConfig.url, axiosConfig.data ?? null, paramsKey],
        queryFn: requestFn,
        ...queryOptions,
      });

      if (preventDuplicateRequest) {
        flagInfo?.throttleRegisterSet.delete(regisId);
      }

      if (cancelPreviousRequest) {
        onDebounceEnd && onDebounceEnd(res);

        flagInfo?.debounceRegisterMap.delete(regisId);
      }

      // 如果 flagInfo 内容为空时，需要将 flag内容清空
      flagInfo?.debounceRegisterMap.size === 0 &&
        flagInfo?.throttleRegisterSet.size === 0 &&
        this.flagRegister.delete(flag);

      return res as unknown as Promise<T>;
    } catch (error) {
      if (!isAxiosCancel(error)) {
        flagInfo?.debounceRegisterMap.delete(regisId);
      }

      return Promise.reject(error);
    }
  }

  get<T = any>(url: string, options?: IRequestOptions) {
    const reqOptions: IRequestOptions = { url, ...options, method: 'GET' };

    return this.request<T>(reqOptions);
  }

  post<T = any>(url: string, data?: any, options?: IRequestOptions) {
    const reqOptions: IRequestOptions = { url, data, ...options, method: 'POST' };

    return this.request<T>(reqOptions);
  }

  patch<T = any>(url: string, data?: any, options?: IRequestOptions) {
    const reqOptions: IRequestOptions = { url, data, ...options, method: 'PATCH' };

    return this.request<T>(reqOptions);
  }

  delete<T = any>(url: string, data?: any, options?: IRequestOptions) {
    const reqOptions: IRequestOptions = { url, data, ...options, method: 'DELETE' };

    return this.request<T>(reqOptions);
  }

  put<T = any>(url: string, data?: any, options?: IRequestOptions) {
    const reqOptions: IRequestOptions = { url, data, ...options, method: 'PUT' };

    return this.request<T>(reqOptions);
  }

  upload<T = any>(
    url: string,
    data?: any,
    uploadFile?: File | Array<File>,
    options?: IRequestOptions
  ) {
    let formData = new FormData();
    let fileName = options?.extra?.name || 'source';

    if (uploadFile) {
      let validFiles: any[] = [];

      if (Array.isArray(uploadFile)) {
        validFiles = uploadFile.map((file) => ({ name: fileName, data: file }));
      } else {
        validFiles = [{ name: fileName, data: uploadFile }];
      }

      validFiles.forEach((file) => formData.append(file.name, file.data));
    }

    Object.entries(data).forEach(([key, value]: [string, any]) => formData.append(key, value));

    return this.request<T>({
      url,
      method: 'POST',
      data: formData,
      timeout: 60000,
      ...options,
    });
  }
}
