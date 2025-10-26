import './CopyUserId.scss';

import { Flex, Tooltip, Typography, message } from 'antd';
import React, { ClassAttributes } from 'react';

import { LIcon } from '@/icon/Icon';
import classNames from 'classnames';
import { useGlobalPresenter } from '@llama-fa/core/context';
import { useMemoizedFn } from 'ahooks';

const { Paragraph, Text } = Typography;

export interface ICopyUserIdProps {
  className?: string;
  showCopy?: boolean;
  style?: React.CSSProperties;
}

export const CopyUserId = React.memo<ICopyUserIdProps>((props) => {
  const { className, style, showCopy = true } = props;

  const user = useGlobalPresenter((ctx) => ctx.user);

  const copyUserId = useMemoizedFn(() => {
    if (!user?.userId) {
      return;
    }

    navigator.clipboard.writeText(user?.userId);
    message.success('已复制到剪贴板');
  });

  if (!showCopy) {
    return <span className="user-id">{user?.userId}</span>;
  }

  return (
    <Paragraph className="user-id-container" ellipsis copyable title="复制用户ID" style={style}>
      {user?.userId}
    </Paragraph>
  );
});
