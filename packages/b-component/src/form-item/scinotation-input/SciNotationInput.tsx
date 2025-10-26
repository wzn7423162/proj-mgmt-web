import { Input, InputProps } from 'antd';
import React, { useMemo, useRef } from 'react';

import { SliderProps } from 'antd/es/slider';
import Style from './SciNotationInput.module.scss';
import { cxb } from '@llama-fa/utils';
import { useMemoizedFn } from 'ahooks';

const cx = cxb.bind(Style);

// 优化后的正则表达式，支持正在输入中的科学计数法
// 支持：整数、小数、科学计数法（包括不完整的输入状态）
const isValidNumber = (str: any) => {
  const value = str?.toString() ?? '';
  // 空字符串允许（用户可能正在删除）
  if (value === '' || value === '+' || value === '-') return true;
  // 只有小数点的情况
  if (value === '.') return true;
  // 科学计数法的不完整状态
  if (/^[+-]?\d*\.?\d*[eE][+-]?$/.test(value)) return true;
  // 完整的数字格式验证
  return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(value);
};

export interface ISciNotationInput
  extends Pick<Partial<InputProps>, 'value' | 'disabled' | 'className' | 'placeholder'> {
  onChange?: (value: string) => void;
  min?: number;
  max?: number;
}

export const SciNotationInput = React.memo((props: ISciNotationInput) => {
  const { value, disabled, className, min, max, onChange } = props;

  const validValue = useMemo(() => {
    if (isValidNumber(value)) {
      return value;
    }

    return '';
  }, [value]);

  const handleChange = useMemoizedFn<Required<InputProps>['onChange']>((event) => {
    const changeValue = event.target.value;

    if (!isValidNumber(changeValue)) {
      return;
    }

    onChange?.(changeValue);
  });

  const handleBlur = useMemoizedFn(() => {
    if (max !== undefined && Number(value) > max) {
      onChange?.(max.toString());
      return;
    }

    if (min !== undefined && Number(value) < min) {
      onChange?.(min.toString());
      return;
    }
  });

  return (
    <Input
      className={className}
      disabled={disabled}
      value={validValue}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
});
