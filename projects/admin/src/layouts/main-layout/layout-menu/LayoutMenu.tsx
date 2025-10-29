import React, { useMemo } from 'react';
import { Menu } from 'antd';
import { useLocation } from 'react-router';
import { ProjectOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import styles from './LayoutMenu.module.scss';
import { routerHelper } from '@/routers/hashRoutes';
import { ERouteName } from '@/routers/types';

interface LayoutMenuProps {
  collapsed: boolean;
}

export const LayoutMenu: React.FC<LayoutMenuProps> = ({ collapsed }) => {
  const location = useLocation();

  const menuItems: MenuProps['items'] = [
    {
      key: ERouteName.projectList,
      icon: <ProjectOutlined />,
      label: '项目列表',
    },
  ];

  const selectedKeys = useMemo(() => {
    const pathname = location.pathname;
    if (pathname.includes('project-detail') || pathname.includes('project-list')) {
      return [ERouteName.projectList];
    }
    return [ERouteName.projectList];
  }, [location.pathname]);

  const handleClick = (info: any) => {
    routerHelper.to(info.key as ERouteName);
  };

  return (
    <Menu
      className={styles.mainLayoutMenu}
      selectedKeys={selectedKeys}
      mode="inline"
      inlineCollapsed={collapsed}
      items={menuItems}
      onClick={handleClick}
    />
  );
};

