import { isPromise } from '../utils';
import { useMemoizedFn } from 'ahooks';
import { useState } from 'react';

export const useLoadingHandler = <T extends any[], R>(handler: (...args: T) => R) => {
  const [loading, setLoading] = useState(false);

  const wrapedHandler = useMemoizedFn((...args: T): R => {
    const result = handler(...args);

    if (isPromise(result)) {
      setLoading(true);

      result.finally(() => setLoading(false));

      return result;
    } else {
      return result;
    }
  });

  return {
    loading,
    setLoading,
    wrapedHandler,
  };
};
