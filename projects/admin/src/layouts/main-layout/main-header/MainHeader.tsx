import React from 'react';
import { Flex, Menu, Popover, Avatar, message } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import styles from './MainHeader.module.scss';
import { routerHelper } from '@/routers/hashRoutes';
import { ERouteName } from '@/routers/types';
import { AuthUtils, cxb } from '@llama-fa/utils';
import { useGlobalPresenter } from '@/context/GlobalContext';

const cx = cxb.bind(styles);

// 用户信息面板
const UserInfoPanel: React.FC = React.memo(() => {
  const user = useGlobalPresenter((ctx) => ctx.user);
  const username = user?.username || 'Admin';
  const userId = user?.userId || '';

  const handleLogout = () => {
    AuthUtils.afterLogout();
    message.success('退出登录成功');
    routerHelper.to(ERouteName.login);
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <div className={cx('userinfoPanelContent')}>
      <div className={cx('userinfo')}>
        <Flex align="center">
          <Flex flex={'0 0 auto'} style={{ marginRight: 12 }}>
            <Avatar size={48} icon={<UserOutlined />} />
          </Flex>
          <div style={{ fontWeight: 'bold', fontSize: 16 }}>{username}</div>
        </Flex>
        {userId && (
          <Flex className={cx('idInfo')} align="center" style={{ marginTop: 8 }}>
            <Flex className={cx('userIdLabel')} flex={'0 0 auto'}>
              用户ID:
            </Flex>
            <span style={{ marginLeft: 10, color: '#666' }}>{userId}</span>
          </Flex>
        )}
      </div>
      <Menu mode="inline" items={menuItems} selectable={false} />
    </div>
  );
});

// 个人导航组件
export const MainHeader: React.FC = () => {
  const user = useGlobalPresenter((ctx) => ctx.user);
  const username = user?.username || 'Admin';

  return (
    <div className={styles.rightContent}>
      <div className={styles.rightContentItem}>
        <Popover
          arrow={false}
          placement="bottomRight"
          content={<UserInfoPanel />}
          overlayClassName={styles.userinfoPanel}
        >
          <div className={cx('userAvatar')}>
            <span className={cx('name')}>{username}</span>
            <Avatar icon={<UserOutlined />} />
          </div>
        </Popover>
      </div>
    </div>
  );
};

