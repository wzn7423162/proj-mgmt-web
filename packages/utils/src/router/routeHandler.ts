import { NavigateOptions, RouteObject, createBrowserRouter } from 'react-router';

import { IRouterItem } from './types';
import { MenuProps } from 'antd/lib';
import { routeErrorBoundary } from './routeLoad';

export type TRouteRecordsMap<T = any> = Map<
  T,
  {
    record: IRouterItem<T>;
    keyPath: string[];
    keyPathRcords: IRouterItem<T>[];
  }
>;

const regisRoutes = (
  recordsMap: TRouteRecordsMap,
  routes: (IRouterItem | RouteObject)[],
  keyPath: string[] = [],
  keyPathRcords: IRouterItem[] = []
) => {
  routes.forEach((route) => {
    const keyedRoute = 'key' in route;
    const selfKeyPath = keyPath.slice();
    const selfKeyPathRcords = keyPathRcords.slice();

    if (route.element) {
      route.element = routeErrorBoundary(route.element);
    }

    if (keyedRoute) {
      selfKeyPath.push(route.key);
      selfKeyPathRcords.push(route);
    }

    if (route.children) {
      regisRoutes(recordsMap, route.children, selfKeyPath, selfKeyPathRcords);
    }

    if (keyedRoute) {
      recordsMap.set(route.key, {
        record: route,
        keyPath: selfKeyPath,
        keyPathRcords: selfKeyPathRcords,
      });
    }
  });
};

export const createRouterHelper = <T>(routes: RouteObject[]) => {
  const protectedRoutesMap: TRouteRecordsMap<T> = new Map();

  regisRoutes(protectedRoutesMap, routes);

  const router = createBrowserRouter(routes);

  return {
    router,
    protectedRoutesMap,
    to: (
      key: T,
      options?: NavigateOptions & {
        query?: Record<string, string>;
      }
    ) => {
      const { query, ...otherProps } = options || {};
      const info = protectedRoutesMap.get(key);
      if (!info) return;

      let path = '';
      info.keyPathRcords.forEach((route) => {
        path += route.path?.startsWith('/') ? route.path.slice(1) : `/${route.path}`;
      });
      if (query) {
        path += `?${new URLSearchParams(query).toString()}`;
      }

      return router.navigate(path || '/', otherProps);
    },
    go: (num: number) => router.navigate(num),
  };
};
