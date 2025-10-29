import { authCodeChecker, baseURLBinder, responseDataFormat, tokenBinder } from './middleware';
import {IRequestInterceptorOption} from './types'
import { PowerfulRequest } from './baseRequest';

// export const reqClient = new PowerfulRequest({
//   timeout: 60000,
//   withCredentials: true,
// });

// reqClient.use({
//   request: baseURLBinder,
//   response: authCodeChecker,
// });

// reqClient.use({
//   request: tokenBinder,
//   response: responseDataFormat,
// });

const cacheReqClient: Record<string, PowerfulRequest> = {};
export function getReqClientWithPrefix(prefix?: string) {
  if (!prefix) {
    prefix = '';
  }
  let reqClient = cacheReqClient[prefix];
  if (reqClient) {
    return reqClient;
  }
  reqClient = new PowerfulRequest({
    timeout: 60000,
    // withCredentials: true,
    extra: {prefix},
  });

  reqClient.use({
    request: baseURLBinder,
    // ...(prefix == '' ? { response: authCodeChecker } : {})
    response: authCodeChecker,
  });

  reqClient.use({
    request: tokenBinder,
    response: responseDataFormat,
  });
  cacheReqClient[prefix] = reqClient;
  return reqClient;
}
export const reqClient = getReqClientWithPrefix('');

export const useMiddlewareForAll = (middleware: IRequestInterceptorOption) => {
  for (let i in cacheReqClient) {
    cacheReqClient[i].use(middleware);
  }
}
