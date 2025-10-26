import { InputNumber } from 'antd';
import React from 'react';
import Style from './TaskMode.module.scss';
import { cxb } from '@llama-fa/utils';
import { useMemoizedFn } from 'ahooks';
const cx = cxb.bind(Style);

export interface IReduceNumberInputProsp {
  value?: any;
  min?: number;
  max?: number;
  onChange?: (value: any) => any;
}

export const ReduceNumberInput = React.memo<IReduceNumberInputProsp>((props) => {
  const { value, onChange, min, max } = props;

  const handleMinus = useMemoizedFn(() => {
    if (min !== undefined && value <= min) return;

    onChange?.(value - 1);
  });

  const handleAdd = useMemoizedFn(() => {
    if (max !== undefined && value >= max) return;

    onChange?.((value ?? 0) + 1);
  });

  return (
    <InputNumber
      className={cx('reduce-number-input')}
      controls={false}
      value={value}
      addonBefore={
        <span className={cx('operation')} onClick={handleMinus}>
          -
        </span>
      }
      addonAfter={
        <span className={cx('operation')} onClick={handleAdd}>
          +
        </span>
      }
    />
  );
});
