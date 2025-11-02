import { reqClient } from '@llama-fa/utils';

export const machineAPI = {
  getList: (params: {
    pageNum: number;
    pageSize: number;
    projectId: number;
    machineName?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    return reqClient.get<any>('/front/machine/list', { params });
  },

  getDetail: (id: number) => {
    return reqClient.get<any>('/front/machine/detail', { params: { id } });
  },

  create: (data: any) => {
    return reqClient.post('/front/machine/create', data);
  },

  update: (data: any) => {
    return reqClient.put('/front/machine/update', data);
  },

  delete: (id: number) => {
    // 注意：delete 第二个参数是 body，params 需要放到第三个参数 options
    return reqClient.delete('/front/machine/delete', undefined, { params: { id } });
  },
};


