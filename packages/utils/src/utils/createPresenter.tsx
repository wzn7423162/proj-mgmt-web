import React, { useEffect, useRef } from 'react';
import { createContext, useContextSelector } from 'use-context-selector';

export function createPresenter<T, P>(hook: (props: P) => Readonly<T>) {
  const Context = createContext(null as T);
  const primaryStore = Object.create(null);
  const keyedInstances = new Map<string, T>();

  primaryStore.current = {} as T;

  function usePresenter<R>(selector: (val: T) => R, eqlFn?: (a: R | null, b: R) => boolean): R {
    const prevValue = useRef<R | null>(null);
    const patchedSelector = (state: T) => {
      const nextValue: R = selector(state);
      if (eqlFn === undefined) return nextValue;
      if (prevValue.current !== null && eqlFn(prevValue.current, nextValue)) {
        return prevValue.current;
      }
      return (prevValue.current = nextValue);
    };
    return useContextSelector(Context, patchedSelector);
  }

  function PresenterProvider(props: P & { children?: React.ReactNode; uniqueKey?: string }) {
    const { children, uniqueKey, ...rest } = props;
    const value = (primaryStore.current = hook(rest as P));

    useEffect(() => {
      if (uniqueKey) {
        keyedInstances.set(uniqueKey, value);
        return () => {
          keyedInstances.delete(uniqueKey);
        };
      }
    }, [uniqueKey, value]);

    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  // 用于在 React 组件外部访问 Store 的函数
  function getPrimaryStore(): T {
    return primaryStore.current;
  }

  // 根据 uniqueKey 获取特定实例的状态
  function getStoreByKey(key: string): T | undefined {
    return keyedInstances.get(key);
  }

  return [usePresenter, PresenterProvider, getPrimaryStore, getStoreByKey] as const;
}
