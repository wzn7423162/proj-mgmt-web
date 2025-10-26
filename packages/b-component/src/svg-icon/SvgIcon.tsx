import { CSSProperties } from 'react';
import React from 'react';

interface SvgIconProps {
  /** SVG图标的颜色 */
  color?: string;
  /** SVG图标的宽度 */
  width?: number | string;
  /** SVG图标的高度 */
  height?: number | string;
  /** SVG图标的名称或路径 */
  icon: string;
  /** 额外的样式 */
  style?: CSSProperties;
  /** 额外的类名 */
  className?: string;
  /** 点击事件 */
  onClick?: () => void;
}
function getFilterFromColor(color: string): string {
  // 这里可以根据具体颜色值返回对应的filter
  // 简化处理，可以根据需要扩展
  const colorMap: { [key: string]: string } = {
    '#ffffff': 'brightness(0) saturate(100%) invert(100%)',
    '#000000': 'brightness(0) saturate(100%)',
    'rgba(62, 128, 204, 1)':
      'brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(1352%) hue-rotate(205deg) brightness(103%) contrast(101%)',
    'rgba(77, 160, 255, 1)':
      'brightness(0) saturate(100%) invert(64%) sepia(100%) saturate(3207%) hue-rotate(205deg) brightness(101%) contrast(101%)',
    '#4D64FF':
      'brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(1352%) hue-rotate(210deg) brightness(103%) contrast(101%)',
    '#3E80CC':
      'brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(1352%) hue-rotate(205deg) brightness(103%) contrast(101%)',
    '#4DA0FF':
      'brightness(0) saturate(100%) invert(64%) sepia(100%) saturate(3207%) hue-rotate(205deg) brightness(101%) contrast(101%)',
  };

  return colorMap[color] || 'none';
}

export const SvgIcon: React.FC<SvgIconProps> = ({
  color = 'rgba(130, 133, 153, 1)',
  width = 24,
  height = 24,
  icon,
  style,
  className,
  onClick,
}) => {
  const svgStyle: CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    fill: color,
    display: 'inline-block',
    verticalAlign: 'middle',
    ...style,
  };

  return (
    <img
      src={icon}
      alt="icon"
      style={{
        ...svgStyle,
        // 使用CSS filter来改变SVG颜色
        filter: color !== '#333333' ? getFilterFromColor(color) : 'none',
      }}
      className={className}
      onClick={onClick}
    />
  );
};

// 将颜色转换为CSS filter的辅助函数
