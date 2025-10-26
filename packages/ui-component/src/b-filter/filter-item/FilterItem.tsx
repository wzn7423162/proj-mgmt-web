import React, { FC } from 'react';
import styles from './FilterItem.module.scss';
import { ButtonItem, IItem } from '../../b-filter/filter-item/ButtonItem';
import { IIBFilterValue } from '../../b-filter/BFilter';

export interface IFilterItemProps {
  title: string;
  list: Array<IItem>;
  value?: Array<string | number>;
  onSelect?: (item: IItem) => void;
  showClear?: boolean;
  onClear?: () => void;
}

export const FilterItem: FC<IFilterItemProps> = (props) => {
  const { title, list, value, onSelect, showClear, onClear } = props;
  return (
    <div className={styles.item}>
      {/* 标题 + 清空当前组 */}
      <div className={styles.title}>{title}</div>
      <div className={styles.list}>
        {list.map((item) => (
          <ButtonItem
            onClick={() => {
              onSelect?.(item);
            }}
            active={Array.isArray(value) ? value.includes(item.value) : false}
            key={item.value}
            item={item}
          />
        ))}
      </div>
    </div>
  );
};
