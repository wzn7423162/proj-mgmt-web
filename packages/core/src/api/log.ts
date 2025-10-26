import { reqClient } from '@llama-fa/utils';

export const getLog = (params: {
  size?: number;
  taskid?: string;
  tail?: number;
  follow?: number;
}) => {
  return reqClient.get('/front/modelBase/getLogInfo', {
    params: {
      size: 100,
      taskid: params.taskid,
      tail: params.tail,
      follow: params.follow,
    },
    extra: {
      hideErrorMessage: true,
    },
  });
};
