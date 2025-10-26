import { reqClient } from '@llama-fa/utils';

export const projectAPI = {
  getList: (params: {
    pageNum: number;
    pageSize: number;
    projectName?: string;
    orderByColumn?: string | null;
    isAsc?: 'asc' | 'desc' | null;
  }) => {
    return reqClient.get<any>('/front/project/list', { params });
  },

  getDetail: (id: number) => {
    return reqClient.get<any>('/front/project/detail', { params: { id } });
  },

  create: (data: any) => {
    return reqClient.post('/front/project/create', data);
  },

  update: (data: any) => {
    return reqClient.put('/front/project/update', data);
  },

  delete: (id: number) => {
    return reqClient.delete('/front/project/delete', { params: { id } });
  },
};


