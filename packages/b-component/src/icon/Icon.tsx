import React from 'react';
import { createFromIconfontCN } from '@ant-design/icons';
// @ts-ignore
import iconFontUrl from 'https://lf1-cdn-tos.bytegoofy.com/obj/iconpark/svg_39598_125.6d24a17d5d4c08d0ef5cd25fc700b5aa.js';

const defaultFontUrl = 'https://lf1-cdn-tos.bytegoofy.com/obj/iconpark/svg_39598_131.915a9ef9c615fc09c8850850080fd821.js';
const inferFrontUrl = 'https://lf1-cdn-tos.bytegoofy.com/obj/iconpark/svg_41156_65.9daa6adfcec5f44d1c2d7d52b5a9f3ab.js';
export const IconFont = createFromIconfontCN({
  // scriptUrl: process.env.NODE_ENV === 'development' ? iconFontUrl : iconFontUrl,
  scriptUrl: process.env.REACT_APP_PLATFORM == 'infer' ? inferFrontUrl : defaultFontUrl,
});

export interface IEvoIconProps {
  type: string;
  size?: number | 'small' | 'default' | 'large';
  className?: string;
  style?: React.CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
}

const sizeMap = {
  small: 16,
  default: 24,
  large: 32,
};

export const LIcon: React.FC<IEvoIconProps> = ({
  type,
  size = 'default',
  className,
  style,
  onClick,
}) => {
  const fontSize = typeof size === 'number' ? size : sizeMap[size];

  return (
    <IconFont
      type={type}
      className={className}
      style={{
        fontSize,
        ...style,
      }}
      onClick={onClick}
    />
  );
};
