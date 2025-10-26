import { useEffect, useRef } from 'react';

interface UsePollingOptions {
  interval?: number;
  enabled?: boolean;
  immediate?: boolean;
  dependencies?: any[];
  fnParams?: any;
}

export const usePolling = (pollingFn: (params?: any) => void, options: UsePollingOptions = {}) => {
  const { interval = 5000, enabled = true, immediate = false, dependencies = [] } = options;

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      pollingFn(options.fnParams);
    }, interval);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [JSON.stringify(dependencies), enabled]);
};
