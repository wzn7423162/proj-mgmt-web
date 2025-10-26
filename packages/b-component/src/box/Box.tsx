import React, { FC, memo } from 'react';

import s from './Box.module.scss';
import classNames from 'classnames';

export interface IBoxProps {
  className?: string;
  style?: React.CSSProperties;
  title?: React.ReactNode;
  children?: React.ReactNode;
}

export const Box: FC<IBoxProps> = memo((props) => {
  const { className, style, title, children } = props;
  return (
    <div className={classNames(s.box, className)} style={style}>
      <span className={s.title}>{title}</span>
      {children}
    </div>
  );
});
