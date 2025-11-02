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
    // 注意：delete 第二个参数是 body，params 需要放到第三个参数 options
    return reqClient.delete('/front/project/delete', undefined, { params: { id } });
  },
};


