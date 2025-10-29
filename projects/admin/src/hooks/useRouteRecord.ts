import { IRouterItem } from '@llama-fa/utils';
import { protectedRoutes } from '@/routers/protectedRoutes';
import { useLocation } from 'react-router';
import { useMemo } from 'react';

export const useRouteRecord = () => {
  const location = useLocation();

  // 递归查找匹配的路由项
  function findRouteName(routes: IRouterItem[], pathname: string): IRouterItem | undefined {
    for (const route of routes) {
      // 完整路径匹配
      const fullPath = `/${route.path}`;

      if (pathname === fullPath || pathname.startsWith(fullPath + '/')) {
        return route;
      }

      // 子路由递归
      if (route.children) {
        const childRoute = findRouteName(
          route.children as IRouterItem[],
          pathname.replace(`/${route.path}`, '')
        );
        if (childRoute) return childRoute;
      }
    }
  }

  const matchRoute = useMemo(() => {
    // 只取第一级路径，如 /project-detail/123 => /projectList
    const paths = location.pathname.split('/').filter(Boolean);
    let matchPath = '';
    if (paths.length > 0) {
      matchPath = '/' + paths[paths.length - 1];
    } else {
      matchPath = '/projectList'; // 默认首页
    }
    // 递归查找
    return findRouteName(protectedRoutes, matchPath);
  }, [location.pathname]);

  return matchRoute;
};

