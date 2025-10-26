import { ERouteName } from './types';
import { IRouterItem } from '@llama-fa/utils';
import React from 'react';
import loadable from '@loadable/component';

const LoginPage = loadable(() =>
  import('../pages/login/LoginPage').then((module) => ({ default: module.LoginPage }))
);
export const loginRoute: IRouterItem = {
  type: 'item',
  key: ERouteName.login,
  path: '/login',
  element: (
    <React.Suspense>
      <LoginPage />
    </React.Suspense>
  ),
};




export const loginRoutes = [loginRoute];
