import React, { FC } from 'react';

import s from './ActionBarDropdownContent.module.scss';

export interface IActionBarDropdownContentProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
}

export interface IActionBarDropdownContentItemProps {
  label: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// 定义复合组件的类型
interface IActionBarDropdownContentComponent extends FC<IActionBarDropdownContentProps> {
  Item: FC<IActionBarDropdownContentItemProps>;
}

export const ActionBarDropdownContent: IActionBarDropdownContentComponent = ((props) => {
  const { children, className, style, title } = props;

  return (
    <div className={`${s.actionBarDropdown} ${className || ''}`} style={style}>
      {/* {title && <div className={s.actionBarTitle}>{title}</div>} */}
      {children}
    </div>
  );
}) as IActionBarDropdownContentComponent;

const ActionBarDropdownContentItem: FC<IActionBarDropdownContentItemProps> = (props) => {
  const { label, children, className, style } = props;

  return (
    <div className={`${s.actionBarItem} ${className || ''}`} style={style}>
      <span className={s.actionBarLabel}>{label}</span>
      <span className={s.actionBarContent}>{children}</span>
    </div>
  );
};

ActionBarDropdownContent.Item = ActionBarDropdownContentItem;
