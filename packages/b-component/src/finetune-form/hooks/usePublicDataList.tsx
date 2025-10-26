import { publicDataList } from '@llama-fa/core/api';
import { useQuery } from '@tanstack/react-query';

export const usePublicDataList = () => {
  const { data: publicDatas, ...restQuery } = useQuery({
    queryKey: ['select-public-data'],
    queryFn: () => {
      return publicDataList({
        dataType: 1,
        pageNum: 0,
        pageSize: 1000,
      });
    },
    gcTime: 1000 * 60 * 60,
    staleTime: 1000 * 60 * 60,
  });

  return {
    publicDatas,
    restQuery,
  };
};
