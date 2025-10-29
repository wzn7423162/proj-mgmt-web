import React, { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { USER_QUERY_KEY } from '@llama-fa/constants';
import { getUserInfo as getUserInfoApi } from '@llama-fa/core/api';
import { getUserAvatar } from '@llama-fa/core/utils';

const globalContext = () => {
  const userQueryResult = useQuery({
    queryKey: [USER_QUERY_KEY],
    queryFn: async () => {
      try {
        const res: any = await getUserInfoApi();
        try {
          res.avatarIndex = getUserAvatar(res);
        } catch (error) {
          // 靜默處理頭像補全錯誤
        }
        return res;
      } catch (error) {
        // 後端暫無個人信息接口時，回退至本地存儲
        const userId = localStorage.getItem('userId') || '';
        const username = localStorage.getItem('username') || '';
        return { userId, username } as any;
      }
    },
  });

  const { data: user, refetch: flushUserInfo } = userQueryResult;

  const getUserInfo = useCallback(() => {
    return flushUserInfo();
  }, [flushUserInfo]);

  return {
    user,
    getUserInfo,
    userQueryResult,
  } as const;
};

// 精簡版 createPresenter，對齊 online 的使用方式
function createPresenter<T, P>(hook: (props: P) => Readonly<T>) {
  const Context = React.createContext(null as unknown as T);

  function usePresenter<R>(selector: (val: T) => R): R {
    const state = React.useContext(Context);
    return selector(state);
  }

  function PresenterProvider(props: P & { children?: React.ReactNode }) {
    const { children, ...rest } = props as any;
    const value = hook(rest);
    return <Context.Provider value={value as T}>{children}</Context.Provider>;
  }

  return [usePresenter, PresenterProvider] as const;
}

export const [useGlobalPresenter, GlobalProvider] = createPresenter<ReturnType<typeof globalContext>, any>(
  globalContext
);

