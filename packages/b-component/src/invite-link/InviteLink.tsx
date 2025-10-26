import React, { FC, memo } from 'react';
import { Button, message } from 'antd';
import { useMemoizedFn } from 'ahooks';
import classNames from 'classnames';

import { LTitle } from '../title/Title';
import s from './InviteLink.module.scss';
import { copyText } from '@llama-fa/utils';

export interface IInviteLinkProps {
  className?: string;
  style?: React.CSSProperties;
  invitationUrl: string;
  onCopy?: (url: string) => void;
}

export const InviteLink: FC<IInviteLinkProps> = memo((props) => {
  const { className, style, invitationUrl, onCopy } = props;

  const handleCopy = useMemoizedFn(async () => {
    copyText(invitationUrl);
    message.success('复制成功');
    onCopy?.(invitationUrl);
  });

  return (
    <div className={classNames(s.wrapper, className)} style={style}>
      <div className={classNames(s.invite)}>
        <span>{invitationUrl}</span>
        <Button style={{ marginLeft: 10 }} type="primary" size="small" onClick={handleCopy}>
          复制链接
        </Button>
      </div>
    </div>
  );
});
