import { useMemoizedFn, useSetState } from 'ahooks';

import { ProFormProps } from '@ant-design/pro-components';
import { bufferDebounce } from '@llama-fa/utils';
import { useState } from 'react';

export const useFullFormData = () => {
  const [fullFormData, setFullFormData] = useSetState<Record<any, any>>({});

  const [buffereSetFullFormData] = useState(() =>
    bufferDebounce<Parameters<Required<ProFormProps>['onValuesChange']>>((bufferedParams) => {
      const mergedData: Record<any, any> = {};

      bufferedParams.forEach((record) => {
        Object.assign(mergedData, record.params[0]);
      });

      setFullFormData(mergedData);
    }, 100)
  );

  return {
    fullFormData,
    setFullFormData,
    buffereSetFullFormData,
  };
};
