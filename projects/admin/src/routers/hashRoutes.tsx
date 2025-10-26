import { Outlet } from 'react-router';
import { RouteObject } from 'react-router';
import { createRouterHelper } from '@llama-fa/utils/router';
// pc路由配置
import { ERouteName } from './types';
import { loginRoutes } from './loginRoutes';
import { protectedRoute } from './protectedRoutes';
import { RouteGuard } from './RouteGuard';

// 移动端的路由配置
import { isMobile as isMobileFunc } from '@llama-fa/utils';

const routes: RouteObject[] = [...loginRoutes, protectedRoute];
const routesWithGuard = [
  {
    path: '/',
    element: (
      <RouteGuard>
        <Outlet />
      </RouteGuard>
    ),
    children: routes,
  },
];

const pcRouterHelper = createRouterHelper<ERouteName>(routesWithGuard);


export const routerHelper = new Proxy(
  {},
  {
    get(target, prop) {
      return pcRouterHelper[prop as keyof typeof pcRouterHelper];
    },
  }
) as any as typeof pcRouterHelper;
