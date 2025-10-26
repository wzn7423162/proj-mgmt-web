import React, { useState } from 'react';
import { Radio, RadioChangeEvent } from 'antd';
import classNames from 'classnames';
import styles from './StatusSearchButton.module.scss';

export interface StatusSearchButtonProps {
  /**
   * 状态列表，例如 ['全部 (55)', '运行中 (20)']
   */
  statuses: {
    label: string;
    value: string;
  }[];
  /** 当前选中的状态 */
  value?: string;
  /** 选中变化回调 */
  onChange?: (status: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const StatusSearchButton: React.FC<StatusSearchButtonProps> = ({
  statuses,
  value,
  onChange,
  className,
  style,
}) => {

  const [selected, setSelected] = useState(value ?? statuses[0].value);

  const handleChange = (e: RadioChangeEvent) => {
    setSelected(e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <Radio.Group
      className={classNames(styles.statusGroup, className)}
      value={selected}
      onChange={handleChange}
      style={style}
    >
      {statuses.map((s) => (
        <Radio.Button key={s.value} value={s.value} className={styles.statusBtn}>
          {s.label}
        </Radio.Button>
      ))}
    </Radio.Group>
  );
};
