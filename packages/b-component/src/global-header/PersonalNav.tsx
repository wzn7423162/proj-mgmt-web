import { AuthUtils, cxb, queryClient, toUcenter } from '@llama-fa/utils';
import { Flex, Menu, Popover } from 'antd';
import { LLAMA_DOCUMENT_URL, USER_QUERY_KEY } from '@llama-fa/constants';

import { CopyUserId } from '@/user/user-id/CopyUserId';
import { LIcon } from '../icon';
import { LTitle } from '@/title/Title';
import { MenuProps } from 'antd/lib';
import React from 'react';
import Style from './GlobalHeader.module.scss';
import { UserAvatar } from '@/user/avatar/UserAvatar';
import { logout } from '@llama-fa/core/api/user';
import { useGlobalPresenter } from '@llama-fa/core/context';
import { useMemoizedFn } from 'ahooks';
import { EUrlPath } from '../../../types/src';

const cx = cxb.bind(Style);

export interface UserInfoPanelProps {
  onPersonalClick?: () => any;
  onBillClick?: () => any;
  onAccessManagementClick?: () => any;
  type?: 'online' | 'ucenter';
}

export interface PersonalNavProps extends UserInfoPanelProps {}

const UserInfoPanel = React.memo<UserInfoPanelProps>((props) => {
  const user = useGlobalPresenter((ctx) => ctx.user);
  const invalidateAllUserData = useGlobalPresenter((ctx) => ctx.invalidateAllUserData);

  const handleToPersonalCenter = useMemoizedFn(() => {
    props.onPersonalClick?.();
  });

  const handleLogout = useMemoizedFn(() => {
    logout().then(() => {
      AuthUtils.afterLogout();

      invalidateAllUserData();
    });
  });

  console.log('type', props.type);

  const menuItems: MenuProps['items'] = [
    {
      key: '3',
      label: '费用中心',
      icon: <LIcon type="zhangdanmingxi" size={'small'} />,
      onClick: () => {
        if(props.type === 'ucenter' && props.onBillClick) {
          props.onBillClick();
        } else {
        toUcenter(EUrlPath.UCENTER_BILL);
        }
      },
    },
    {
      key: '4',
      label: '访问管理',
      icon: <LIcon type="fangwenguanli" size={'small'} />,
      onClick: () => {
        if(props.type === 'ucenter' && props.onAccessManagementClick) {
          props.onAccessManagementClick();
        } else {
          toUcenter(EUrlPath.UCENTER_ACCESS);
        }
      }
    },
    {
      key: '1',
      label: '个人中心',
      icon: <LIcon type="people" size={'small'} />,
      onClick: handleToPersonalCenter,
    },
    {
      key: '2',
      label: '退出登录',
      icon: <LIcon type="logout" size={'small'} />,
      onClick: handleLogout,
    },
  ];

  return (
    <div className={cx('userinfo-panel-content')}>
      <div className={cx('userinfo')}>
        <Flex align="center">
          <Flex flex={'0 0 auto'} style={{ marginRight: 12 }}>
            <UserAvatar size={48} />
          </Flex>
          <LTitle bold size={20}>
            {user?.userName}
          </LTitle>
        </Flex>
        <Flex className={cx('id-info')} align="center">
          <Flex className={cx('user-id-label')} flex={'0 0 auto'}>
            用户ID:
          </Flex>
          <CopyUserId style={{ marginLeft: 10 }} />
        </Flex>
      </div>
      <Menu mode="inline" items={menuItems} selectable={false} />
    </div>
  );
});

export const PersonalNav = React.memo<PersonalNavProps>((props) => {
  const user = useGlobalPresenter((ctx) => ctx.user);

  return (
    <Popover
      arrow={false}
      classNames={{
        root: cx('userinfo-panel'),
      }}
      placement="bottomRight"
      content={<UserInfoPanel {...props} />}
    >
      <div className={cx('user-avatar')}>
        <span className={cx('name')}>{user?.userName}</span>
        <UserAvatar />
      </div>
    </Popover>
  );
});
