import { IRequestOptions, reqClient } from '@llama-fa/utils';

export const filesUserDatasets = (params: any, options: IRequestOptions) => {
  return reqClient.get<string[]>(`/front/fileManage/filesUserDatasets`, { params, ...options });
};
