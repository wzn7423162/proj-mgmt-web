import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getLoraBaseModelList, ILoraBaseModelItem } from '../api/finetune';

export const useLoraBaseModelList = (params: { selectedModelId?: string; modelType?: string } = {}) => {
  const [baseModelIDCache, setBaseModelIDCache] = useState<Record<string, number>>({});
  const [baseModelList, setBaseModelList] = useState<ILoraBaseModelItem[]>([]);

  const { data: baseModelListData, ...restQuery } = useQuery({
    queryKey: ['get-lora-basemodel-list', params.modelType || 'ALL'],
    queryFn: () => {
      return getLoraBaseModelList({
        pageNum: 0,
        pageSize: 1000,
        modelType: params.modelType,
      });
    },
    gcTime: 1000 * 60 * 60,
    staleTime: 1000 * 60 * 60,
  });
  useMemo(() => {
    let list = baseModelListData?.list || [];

    let cache: Record<string, number> = {};
    list.forEach((item) => {
      cache[item.name] = item.id;
    });

    setBaseModelIDCache(cache);
    setBaseModelList(list);
  }, [baseModelListData]);

  const getBaseModelIdByName = useCallback(
    (name: string) => {
      return baseModelIDCache[name];
    },
    [baseModelIDCache]
  );

  return {
    baseModelList,
    baseModelArray: baseModelListData?.list || [],
    restQuery,
    getBaseModelIdByName,
  };
};
