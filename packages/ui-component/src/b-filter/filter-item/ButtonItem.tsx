import React, { FC } from 'react';
import classNames from 'classnames';
import style from './ButtonItem.module.scss';
import { Tooltip } from 'antd';

export interface IItem {
  label: string;
  value: string | number;
}
export interface IButtonItemProps {
  item?: IItem;
  onClick?: (item: IItem) => void;
  active?: boolean;
}

export const ButtonItem: FC<IButtonItemProps> = (props) => {
  const { item, onClick, active } = props;
  return (
    <div
      onClick={() => {
        onClick?.(item!);
      }}
      className={classNames(style.button, { [style.active]: active })}
    >
      <Tooltip title={item?.label}>{item?.label}</Tooltip>
    </div>
  );
};
