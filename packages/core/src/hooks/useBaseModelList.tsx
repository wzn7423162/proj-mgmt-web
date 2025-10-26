import { modelBaseList } from '@llama-fa/core/api';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

export const useBaseModelList = (params: { selectedModelId?: string } = {}) => {
  const { selectedModelId } = params;

  const { data: baseModelList, ...restQuery } = useQuery({
    queryKey: ['select-training-data'],
    queryFn: () => {
      return modelBaseList({
        pageNum: 0,
        pageSize: 1000,
      });
    },
    gcTime: 1000 * 60 * 60,
    staleTime: 1000 * 60 * 60,
  });

  const selectedModelInfo = useMemo(() => {
    if (!selectedModelId || !baseModelList?.list) return undefined;

    return baseModelList.list.find((item) => item.id === selectedModelId);
  }, [selectedModelId, baseModelList]);

  return {
    baseModelList,
    selectedModelInfo,
    restQuery,
  };
};
