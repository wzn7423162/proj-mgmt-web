import { EEnumRenderType, EFinetuneMode } from '@llama-fa/types';
import {
  Flex,
  Form,
  Input,
  InputNumber,
  InputNumberProps,
  RadioGroupProps,
  RadioProps,
  Select,
  SelectProps,
  Slider,
  Switch,
} from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useGetState, useMemoizedFn } from 'ahooks';

import { ISchemaFormItemRenderProps } from './types';
import { Radio } from 'antd/lib';
import { SciNotationInput } from '../scinotation-input/SciNotationInput';
import Style from './SchemaFormItem.module.scss';
import { cxb } from '@llama-fa/utils';
import { useRef } from 'react';

const cx = cxb.bind(Style);
export const BooleanRender = React.memo<ISchemaFormItemRenderProps>((props) => {
  const { value, onChange, readonly } = props;

  return <Switch disabled={readonly} value={value} onChange={onChange} />;
});

export const EnumRender = React.memo<ISchemaFormItemRenderProps>((props) => {
  const {
    value: propValue,
    onChange: propOnChange,
    enum_render_type,
    enum_options = [],
    extraFieldProps,
    mode,
    readonly,
    placeholder,
  } = props;

  const [value, setValue] = useGetState(propValue);
  const selectionInfoRef = useRef({
    value,
    visible: false,
  });

  const handleChange = useMemoizedFn((value) => {
    selectionInfoRef.current.value = value;

    setValue(value);

    if (!selectionInfoRef.current.visible) {
      propOnChange?.(value);
    }
  });

  const handleVisibleChange = useMemoizedFn((visible: boolean) => {
    selectionInfoRef.current.visible = visible;

    if (!visible) {
      propOnChange?.(selectionInfoRef.current.value);
    }
  });

  useEffect(() => {
    setValue(propValue);
    selectionInfoRef.current.value = propValue;
  }, [propValue]);

  const enumOptions = useMemo(() => {
    const optionResult: SelectProps['options'] = [];

    enum_options.forEach((item) => {
      if (item.only_in_expert) {
        if (mode === EFinetuneMode.quick) {
          return;
        }
      }

      optionResult.push({
        label: item.name,
        value: item.value,
      });
    });

    return optionResult;
  }, [enum_options]);

  if (enum_render_type === EEnumRenderType.radio) {
    return (
      <Radio.Group
        disabled={readonly}
        value={value}
        onChange={propOnChange}
        optionType="button"
        options={enumOptions as any}
      />
    );
  }

  const mergedExtraFieldProps =
    extraFieldProps?.showSearch !== false
      ? ({
          showSearch: true,
          filterOption: (input, option) =>
            ((option?.label ?? '') as string).toLowerCase().includes(input.toLowerCase()),
          ...extraFieldProps,
        } as SelectProps)
      : extraFieldProps;

  return (
    <Select
      disabled={readonly}
      options={enumOptions}
      value={value}
      onChange={handleChange}
      onOpenChange={handleVisibleChange}
      placeholder={placeholder}
      {...mergedExtraFieldProps}
    />
  );
});

export const IntRender = React.memo<ISchemaFormItemRenderProps>((props) => {
  const { value, onChange, number_range, extraFieldProps, readonly, data_type, placeholder } =
    props;

  const handleInputChange = useMemoizedFn<Required<InputNumberProps>['onChange']>((value) => {
    onChange?.(value as any);
  });

  const SliderRender = props.number_render_type === 'slider' ? Slider : null;

  const composeProps = useMemo(() => {
    return {
      value,
      placeholder,
      onChange: handleInputChange,
      min: number_range?.min,
      max: number_range?.max,
      step: number_range?.steps ?? 1,
    };
  }, [value, handleInputChange, number_range]);

  return (
    <Flex align="center" className={cx('slider-input', { 'render-slider': SliderRender })}>
      {SliderRender ? (
        <Slider disabled={readonly} {...composeProps} className={cx('slider')} />
      ) : null}
      {data_type === 'float2' ? (
        <SciNotationInput
          disabled={readonly}
          {...composeProps}
          className={cx('input')}
          {...extraFieldProps}
        />
      ) : (
        <InputNumber
          disabled={readonly}
          {...composeProps}
          className={cx('input')}
          {...extraFieldProps}
        />
      )}
    </Flex>
  );
});

export const StringRender = React.memo<ISchemaFormItemRenderProps>((props) => {
  const { value, onChange, extraFieldProps, readonly, placeholder } = props;
  return (
    <Input
      disabled={readonly}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...extraFieldProps}
    />
  );
});

export const Strin2gRender = React.memo<ISchemaFormItemRenderProps>((props) => {
  const { value, onChange, extraFieldProps, readonly, placeholder } = props;
  return (
    <Input.TextArea
      disabled={readonly}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...extraFieldProps}
    />
  );
});
