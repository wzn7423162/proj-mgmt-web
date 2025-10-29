import { ERouteName } from './types';
import { IRouterItem } from '@llama-fa/utils';
import { LIcon } from '@llama-fa/component';
import { Navigate } from 'react-router';
import React from 'react';
import loadable from '@loadable/component';

const Main = loadable(() =>
  import('../layouts/main-layout/MainLayout').then((module) => ({ default: module.MainLayout }))
);

const ProjectListPage = loadable(() =>
  import('../pages/project-list/ProjectListPage').then((module) => ({
    default: module.ProjectListPage,
  }))
);

const ProjectDetailPage = loadable(() =>
  import('../pages/project-detail/ProjectDetailPage').then((module) => ({
    default: module.ProjectDetailPage,
  }))
);

export const protectedRoutes: IRouterItem[] = [
  {
    type: 'item',
    key: ERouteName.projectList,
    path: ERouteName.projectList,
    label: '项目列表',
    element: (
      <React.Suspense>
        <ProjectListPage />
      </React.Suspense>
    ),
  },
  {
    type: 'item',
    key: ERouteName.projectDetail,
    path: ERouteName.projectList,
    hidden: true,
    label: '项目详情',
    element: (
      <React.Suspense>
        <ProjectDetailPage />
      </React.Suspense>
    ),
  },
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
      element: <Navigate to="/project-list" replace />,
    },
    ...protectedRoutes,
  ],
};
