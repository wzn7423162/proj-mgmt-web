import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { InputProps } from 'antd';
export type ExtraParams = Record<string, any>;

/**
 * 为 ProTable 的列筛选表单项 (文本输入框) 生成 fieldProps
 * @param key - 在 extraParams 中对应的键名
 * @param extraParams - ProTable 的 extraParams state
 * @param setExtraParams - ProTable 的 extraParams state 的 setter
 * @param placeholder - 输入框的 placeholder
 * @param defaultValue - 输入框的默认值
 * @returns antd ProTable column's fieldProps object
 */
export const useCreateTextInputFieldProps = (
  key: string,
  extraParams: ExtraParams,
  setExtraParams: Dispatch<SetStateAction<ExtraParams>>,
  placeholder?: string,
  defaultValue?: string
): InputProps => {
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    setValue(defaultValue || '');
  }, [defaultValue]);

  return {
    placeholder,
    // className: 'select-or-input-filter-col',
    onPressEnter: (e: React.KeyboardEvent<HTMLInputElement>) => {
      const val = (e.target as HTMLInputElement)?.value?.trim();
      setExtraParams({
        ...extraParams,
        [key]: val ? val.trim() : undefined, // 使用 undefined 以便在值为空时从参数中移除该键
      });
      setValue(val ? val.trim() : '');
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      const val = (e.target as HTMLInputElement)?.value?.trim();
      if (val === extraParams[key]) {
        return;
      }
      setExtraParams({
        ...extraParams,
        [key]: val ? val.trim() : undefined, // 使用 undefined 以便在值为空时从参数中移除该键
      });
      setValue(val ? val.trim() : '');
    },
    onClear: () => {
      setExtraParams({
        ...extraParams,
        [key]: undefined,
      });
      setValue('');
    },
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    },
  };
};

/**
 * 为 ProTable 的列筛选表单项 (如 Select, DatePicker) 生成 fieldProps
 * @param key - 在 extraParams 中对应的键名
 * @param extraParams - ProTable 的 extraParams state
 * @param setExtraParams - ProTable 的 extraParams state 的 setter
 * @param placeholder - 输入框的 placeholder
 * @returns antd ProTable column's fieldProps object
 */
export const createSelectFieldProps = (
  key: string,
  extraParams: ExtraParams,
  setExtraParams: Dispatch<SetStateAction<ExtraParams>>,
  placeholder?: string | string[]
) => {
  return {
    placeholder,
    // className: 'select-or-input-filter-col',
    onChange: (value: any) => {
      setExtraParams({
        ...extraParams,
        [key]: value,
      });
    },
  };
};

/**
 * 为 ProTable 的列筛选表单项 (日期选择器) 生成 fieldProps
 * @param otherProps - 在 extraParams 中对应的键名
 * @param extraParams - ProTable 的 extraParams state
 * @param setExtraParams - ProTable 的 extraParams state 的 setter
 * @param placeholder - 输入框的 placeholder
 * @param hasDefaultDate - 是否默认显示30天前的日期
 * @returns antd ProTable column's fieldProps object
 */
export const createDatePickerFieldProps = (
  otherProps: string | Record<string, string>,
  extraParams: ExtraParams,
  setExtraParams: Dispatch<SetStateAction<ExtraParams>>,
  placeholder?: string | string[],
  hasDefaultDate = true
) => {
  let otherPropsObj: Record<string, string> = {};
  //为了兼容旧的api
  if (typeof otherProps === 'object') {
    otherPropsObj = otherProps;
  }
  const startKey = otherPropsObj.startKey || 'startDate';
  const endKey = otherPropsObj.endKey || 'endDate';
  console.log('hasDefaultDate', hasDefaultDate);
  return {
    showTime: true,
    format: 'YYYY-MM-DD HH:mm:ss',
    placeholder: ['开始时间', '结束时间'],
    disabledDate: (current: any) => {
      // 禁用今天之后的日期
      return current && current > dayjs().endOf('day');
    },
    // className: 'time-filter-col',

    defaultValue: hasDefaultDate
      ? [dayjs().startOf('day').subtract(30, 'day'), dayjs()]
      : undefined,
    onChange: (value: any) => {
      console.log('dateRange value', value);

      // 值变化时触发查询
      if (value && value.length === 2) {
        setExtraParams({
          ...extraParams,
          [startKey]: value[0].format('YYYY-MM-DD HH:mm:ss'),
          [endKey]: value[1].format('YYYY-MM-DD HH:mm:ss'),
        });
      } else {
        // 如果清空了日期，也要清空相关参数
        const { [startKey]: _s, [endKey]: _e, ...rest } = extraParams;
        setExtraParams({ ...rest, [startKey]: null, [endKey]: null });
      }
    },
  };
};

/**
 * 转化pro table的value枚举
 * @param data
 * @returns
 */
export const convertProTableValueEnum = (data: Array<{ value: any; label: string }>) => {
  return data?.reduce(
    (prev, cur) => {
      prev[cur.value] = cur.label;
      return prev;
    },
    {} as Record<string, string>
  );
};

export const defaultDateRange = {
  startDate: dayjs().startOf('day').subtract(30, 'day').format('YYYY-MM-DD HH:mm:ss'),
  endDate: dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
};
