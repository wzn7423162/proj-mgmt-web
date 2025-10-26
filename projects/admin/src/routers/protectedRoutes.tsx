import { ERouteName } from './types';
import { IRouterItem } from '@llama-fa/utils';
import { LIcon } from '@llama-fa/component';
import { Navigate } from 'react-router';
import React from 'react';
import loadable from '@loadable/component';


const Main = loadable(() =>
  import('../layouts/main-layout/MainLayout').then((module) => ({ default: module.MainLayout }))
);

export const protectedRoutes: IRouterItem[] = [


];
export const protectedRoute: IRouterItem = {
  key: ERouteName.main,
  path: '/',
  element: (
    <React.Suspense>
      <Main />
    </React.Suspense>
  ),
  children: [
    {
      index: true,
      element: <Navigate to="/console" replace />,
    },
    ...protectedRoutes,
  ],
};
