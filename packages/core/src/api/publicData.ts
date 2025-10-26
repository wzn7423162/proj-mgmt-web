import { reqClient } from '@llama-fa/utils';

export const publicDataList = (params: { dataType: number; pageNum: number; pageSize: number }) => {
  return reqClient.get('/front/data/list', { params });
};

export const dictTypeListAPI = (dictType: string) => {
  return reqClient.get<any[]>('/front/dict/data/type', {
    params: { dictType },
  });
};

export const textContentSafeAPI = (data: { text: string }) => {
  return reqClient.post('/front/text/contentSafe', data);
};
