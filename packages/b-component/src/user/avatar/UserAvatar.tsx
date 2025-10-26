import { Avatar, AvatarProps } from 'antd';

import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { getUserAvatarUrl } from '@llama-fa/core/utils';
import { useGlobalPresenter } from '@llama-fa/core/context';

export interface IUserAvatarProps extends AvatarProps {}

export const UserAvatar = React.memo<IUserAvatarProps>((props) => {
  const user = useGlobalPresenter((ctx) => ctx.user);

  if (!user) return;

  return <Avatar src={getUserAvatarUrl(user?.avatarIndex)} {...props} />;
});
