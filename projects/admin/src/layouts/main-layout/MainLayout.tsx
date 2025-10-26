import React from 'react';
import { Layout, Menu, Dropdown, Avatar, message, Breadcrumb } from 'antd';
import {
  ProjectOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';
import styles from './MainLayout.module.scss';

const { Header, Sider, Content } = Layout;

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem('username') || 'Admin';
  const [collapsed, setCollapsed] = React.useState(false);

  const handleLogout = () => {
    localStorage.clear();
    message.success('退出登录成功');
    navigate('/login');
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  const menuItems: MenuProps['items'] = [
    {
      key: '/project-list',
      icon: <ProjectOutlined />,
      label: '项目列表',
      onClick: () => navigate('/project-list'),
    },
  ];

  // 获取当前选中的菜单项
  const selectedKey = location.pathname.startsWith('/project-detail')
    ? '/project-list'
    : location.pathname;

  const renderBreadcrumb = () => {
    if (location.pathname.startsWith('/project-detail')) {
      return (
        <Breadcrumb items={[{ title: '项目列表', onClick: () => navigate('/project-list') }, { title: '项目详情' }]} />
      );
    }
    return <Breadcrumb items={[{ title: '项目列表' }]} />;
  };

  return (
    <Layout className={styles.mainLayout}>
      <Sider
        width={220}
        className={styles.sider}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
      >
        <div className={styles.logo}>
          <ProjectOutlined style={{ fontSize: 22, marginRight: 8 }} />
          {!collapsed && <span>项目管理系统</span>}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          className={styles.menu}
        />
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.trigger} onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </span>
            <div className={styles.breadcrumb}>{renderBreadcrumb()}</div>
          </div>
          <div className={styles.headerRight}>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div className={styles.userInfo}>
                <Avatar icon={<UserOutlined />} />
                <span className={styles.username}>{username}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className={styles.content}>
          <div className={styles.contentCard}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

