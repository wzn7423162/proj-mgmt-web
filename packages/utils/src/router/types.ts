import { MenuProps } from 'antd';
import { RouteObject } from 'react-router';

type MenuItem = Required<MenuProps>['items'][number];

export type IRouterItem<T = any> = RouteObject &
  MenuItem & {
    key: T;
    hidden?: boolean;
    // 隐藏布局层根据路由配置显示标题的能力
    hiddenTitle?: boolean;
    // layout层渲染4号区内容时，不再使用通用嵌套结构，直接渲染组件内容
    pureLayoutContainer?: boolean;
    // 路由配置的标题，会根据路由配置的hiddenTitle属性，在layout层显示
    label?: React.ReactNode;
    // 子标题
    subTitle?: React.ReactNode;
    extraContentProps?: React.HTMLAttributes<HTMLDivElement>;
    // 是否没有左侧菜单
    hasNoLeft?: boolean;
    // 是否强制需要登录
    mustLogin?: boolean;
  };
