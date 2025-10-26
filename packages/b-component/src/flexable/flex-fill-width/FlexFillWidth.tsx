import React, { HTMLAttributes, PropsWithChildren } from 'react';

import cxb from 'classnames/bind';
import style from './Style.module.scss';

const cx = cxb.bind(style);

export interface IFlexFillWidthProps extends HTMLAttributes<HTMLDivElement> {
  wrapClassName?: string;
  wrapStyle?: React.CSSProperties;
}

export const FlexFillWidth = React.memo<PropsWithChildren<IFlexFillWidthProps>>((props, ref) => {
  const { wrapClassName, wrapStyle, className, children, ...restContentProps } = props;

  return (
    <div className={cx(['flex-fill-width-wrap', wrapClassName])} style={wrapStyle}>
      <div className={cx(['flex-fill-width-content', className])} {...restContentProps}>
        {children}
      </div>
    </div>
  );
});
