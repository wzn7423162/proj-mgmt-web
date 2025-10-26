import React, { FC, isValidElement, memo } from 'react';
import { Flex, Tooltip, Typography } from 'antd';
import { LIcon } from '@llama-fa/component';
import { TooltipPlacement } from 'antd/es/tooltip';

const { Paragraph } = Typography
export interface IIconTextProps {
  /** 是否显示提示 */
  showTip?: boolean;
  /** text提示位置 */
  placement?: TooltipPlacement;
  /** 图标*/
  icon?: string | React.ReactNode;
  /** 图标提示 */
  iconTip?: string | React.ReactNode;
  /** 文案 */
  text: string | undefined | null;
  /** 整体/text提示 */
  tip?: string;
  /** 文案样式 */
  textStyle?: React.CSSProperties;
  /** 文案className */
  textClassName?: string;
  /** 样式 */
  style?: React.CSSProperties;
  /** className */
  className?: string;
  /** 颜色 */
  color?: string;

}
/** 带图标的文本 */
export const IconText: FC<IIconTextProps> = memo(({ showTip = true, icon = 'iconabout-01', iconTip = '', placement = 'topLeft', text = '', tip = '', textStyle = {}, textClassName, style, className, color, ...otherProps }) => {

  const iconRender = () => {
    return (<Flex align='center'>{isValidElement(icon) ? icon : <LIcon type={icon as string} size={16} />}</Flex>)
  };
  const iconTipRender = () => {
    if (!icon) return null
    return (showTip && iconTip ? <Tooltip title={iconTip} placement='top'>
      {iconRender()}
    </Tooltip > : iconRender())
  }

  return (<Flex gap={8} align='center' className={className} style={{ cursor: 'pointer', color, ...style }}>
    {iconTipRender()}
    {showTip && (tip || text) ? <Tooltip title={tip || text} placement={placement} {...otherProps}>
      <Paragraph className={textClassName} ellipsis style={{ color: color || 'inherit', ...textStyle }} > {text || ''}</Paragraph>
    </Tooltip> : <Paragraph className={textClassName} ellipsis style={{ color: color || 'inherit', ...textStyle }} > {text || ''}</Paragraph>}
  </Flex>)
})


