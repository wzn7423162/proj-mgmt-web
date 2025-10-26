import { Flex, Form, InputNumber, Slider } from 'antd';
import { InputNumberProps, SliderSingleProps } from 'antd/lib';

import React from 'react';
import { SliderProps } from 'antd/es/slider';
import Style from './SliderInput.module.scss';
import { cxb } from '@llama-fa/utils';
import { useMemoizedFn } from 'ahooks';

const cx = cxb.bind(Style);

export interface SliderInput extends Pick<Partial<SliderSingleProps>, 'min' | 'max'> {
  value?: number;
  onChange?: (value: number | null) => void;
}

export const SliderInput = React.memo((props: SliderInput) => {
  const { onChange, ...restProps } = props;

  const handleInputChange = useMemoizedFn<Required<InputNumberProps>['onChange']>((value) => {
    onChange?.(value as any);
  });

  return (
    <Flex align="center" className={cx('slider-input')}>
      <Slider {...restProps} className={cx('slider')} onChange={handleInputChange} />
      <InputNumber {...restProps} className={cx('input')} onChange={handleInputChange} />
    </Flex>
  );
});
