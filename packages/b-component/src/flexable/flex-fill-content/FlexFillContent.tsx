import React, { HTMLAttributes, PropsWithChildren } from 'react';

import cxb from 'classnames/bind';
import style from './Style.module.scss';

const cx = cxb.bind(style);

export interface IFlexFillContentProps extends HTMLAttributes<HTMLDivElement> {
  wrapClassName?: string;
  wrapStyle?: React.CSSProperties;
}

export const FlexFillContent = React.memo(
  React.forwardRef<any, PropsWithChildren<IFlexFillContentProps>>((props, ref) => {
    const { wrapClassName, className, wrapStyle, children, ...restContentProps } = props;

    return (
      <div className={cx(['flex-fill-content-wrap', wrapClassName])} style={wrapStyle}>
        <div className={cx(['flex-fill-content', className])} {...restContentProps} ref={ref}>
          {children}
        </div>
      </div>
    );
  })
);
