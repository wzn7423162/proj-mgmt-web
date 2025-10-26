import React, { FC, memo } from 'react';

import classNames from 'classnames';
import s from './TitleNew.module.scss';

export interface ITitleProps extends Partial<React.DOMAttributes<HTMLElement>> {
  size?: 'small' | 'medium' | 'large' | number;
  /**
   * 字体是否加粗
   */
  bold?: boolean;
  title?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  /**
   * 文字颜色继承
   */
  colorInherit?: boolean;
  onClick?: () => void;
}

const TitleSize = {
  small: 14,
  medium: 16,
  large: 18,
};

export const LTitle: FC<ITitleProps> = memo((props) => {
  const {
    size = 'small',
    title,
    bold,
    colorInherit,
    children,
    style,
    className,
    ...restProps
  } = props;
  // const realSize: keyof typeof TitleSize = size;

  const sizeNumber = typeof size === 'string' ? TitleSize[size] : size;
  const currStyle = {
    color: colorInherit ? 'inherit' : undefined,
    fontWeight: bold ? 'bold' : 'normal',
    fontSize: sizeNumber,
    ...style,
  };
  return (
    <span className={classNames(s.title, className)} style={currStyle} {...restProps}>
      {title || children}
    </span>
  );
});
