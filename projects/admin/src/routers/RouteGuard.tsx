import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { AuthUtils } from '@llama-fa/utils';
import {
  SESSION_STORAGE_PERSIST_SEARCH_PARAMS,
  EStoragePersistSearchParamKey,
} from '@llama-fa/constants';
import { useGlobalPresenter } from '../context/GlobalContext';

const PERSIST_SEARCH_PARAMS_KEYS = [EStoragePersistSearchParamKey.UTM_SOURCE];

export const RouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const getUserInfo = useGlobalPresenter((ctx) => ctx.getUserInfo);

  const isLogin = !!AuthUtils.getToken();

  // 初始化用户信息
  useEffect(() => {
    if (isLogin) {
      getUserInfo();
    }
  }, [isLogin, getUserInfo]);

  useEffect(() => {
    const persitSearchParamsObj = JSON.parse(
      sessionStorage.getItem(SESSION_STORAGE_PERSIST_SEARCH_PARAMS) || '{}'
    );

    sessionStorage.removeItem(SESSION_STORAGE_PERSIST_SEARCH_PARAMS);

    const searchParams = new URLSearchParams(location.search);

    const mergedPersitSearchParams = new URLSearchParams(persitSearchParamsObj);

    PERSIST_SEARCH_PARAMS_KEYS.forEach((key) => {
      const keyValue = searchParams.get(key);
      if (keyValue) {
        mergedPersitSearchParams.set(key, keyValue);
        searchParams.delete(key);
      }
    });

    // 已经登录并且不是在注册页
    if (isLogin && location.pathname !== '/register') {
      mergedPersitSearchParams.delete(EStoragePersistSearchParamKey.UTM_SOURCE);
    }

    if (mergedPersitSearchParams.size) {
      sessionStorage.setItem(
        SESSION_STORAGE_PERSIST_SEARCH_PARAMS,
        JSON.stringify(Object.fromEntries(mergedPersitSearchParams.entries()))
      );
    }

    const mergedSearchParams = new URLSearchParams({
      ...Object.fromEntries(mergedPersitSearchParams.entries()),
      ...Object.fromEntries(searchParams.entries()),
    });
    const newUrl = `${location.pathname}?${mergedSearchParams.toString()}`;

    if (location.search !== newUrl.replace(location.pathname, '')) {
      navigate(newUrl, { replace: true });
    }
  }, [location.pathname, location.search, navigate, isLogin]);

  return <>{children}</>;
};
