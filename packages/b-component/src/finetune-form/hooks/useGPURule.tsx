import { EScenarioType, SERVER_QUERY_KEY, SERVER_RULE_KEY } from '@llama-fa/constants';

import { getServerRule } from '@llama-fa/core/api';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

export const useGPURule = () => {
  const { data: serverRuledData, ...restQuery } = useQuery({
    queryKey: [SERVER_QUERY_KEY, SERVER_RULE_KEY],
    queryFn: getServerRule,
    staleTime: 10 * 1000,
    gcTime: 10 * 1000,
  });

  const GPURule = useMemo(() => {
    if (!serverRuledData) return;

    return serverRuledData.find((item) => item.scenarioType === EScenarioType.TRAIN);
  }, [serverRuledData]);

  return GPURule;
};
