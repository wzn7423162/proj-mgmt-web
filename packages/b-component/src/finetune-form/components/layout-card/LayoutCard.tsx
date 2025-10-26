import React, { PropsWithChildren } from 'react';

import Style from './LayoutCard.module.scss';
import { cxb } from '@llama-fa/utils';
import classNames from 'classnames';

const cx = cxb.bind(Style);

export interface ILayoutCardProps {
  title: string;
  extra?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export const LayoutCard = React.memo<PropsWithChildren<ILayoutCardProps>>((props) => {
  const { title, extra, children, style, className } = props;

  return (
    <div style={style} className={classNames(cx('finetune-layout-card'), className)}>
      <div className={cx('title-row')}>
        <div className={cx('title')}>{title}</div>
        {extra ? <div className={cx('extra')}>{extra}</div> : null}
      </div>
      {children}
    </div>
  );
});
