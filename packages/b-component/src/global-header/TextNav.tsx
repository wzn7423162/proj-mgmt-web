import React from 'react';
import { cxb } from '@llama-fa/utils';
import Style from './GlobalHeader.module.scss';
import { LTitle } from '@/title/Title';
import { useMemoizedFn } from 'ahooks';
import { LIcon } from '../icon';

const cx = cxb.bind(Style);

export interface TextNavProps {
  title: string;
  icon: string;
  onClick?: () => void;
}

export const TextNav = React.memo<TextNavProps>((props) => {
  const handleClick = useMemoizedFn(() => {
    props.onClick?.();
  });

  return (
    <span className={cx('btn-item', 'clickable-text-hover')}>
      <LIcon type={props.icon} size={'small'} />
      <LTitle title={props.title} style={{ color: 'inherit' }} onClick={handleClick} />
    </span>
  );
});


