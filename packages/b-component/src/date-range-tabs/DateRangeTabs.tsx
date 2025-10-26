import React, { useState } from 'react';
import { Segmented, ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import styles from './DateRangeTabs.module.scss';

export interface DateRangeTabsChange {
  startDate: string | null;
  endDate: string | null;
}

export interface DateRangeTabsProps {
  /** 切换回调 */
  onChange?: (range: DateRangeTabsChange) => void;
  /** 默认选中值，默认 all */
  defaultValue?: EDataRange;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

export enum EDataRange {
  'all' = 'all',
  '7d' = '7d',
  '30d' = '30d',
}

export const DATE_RANGE_MAP = {
  [EDataRange.all]: {
    startDate: null,
    endDate: null,
  },
  [EDataRange['7d']]: {
    startDate: dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    endDate: dayjs().add(8, 'day').endOf('day').format('YYYY-MM-DD HH:mm:ss'),
  },
  [EDataRange['30d']]: {
    startDate: dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    endDate: dayjs().add(31, 'day').endOf('day').format('YYYY-MM-DD HH:mm:ss'),
  },
};

/**
 * 根据key获取DataRange内容
 * @param key
 * @returns
 */
export const getDataRangeByKey = (key: EDataRange) => {
  const result = DATE_RANGE_MAP[key];
  if (!result) {
    return DATE_RANGE_MAP[EDataRange.all]
  }
  return result;
}

/**
 * 日期范围快速切换组件
 * 默认提供 "全部" 与 "7天" 两个快捷选项
 */
export const DateRangeTabs: React.FC<DateRangeTabsProps> = ({ onChange, defaultValue = EDataRange.all, style = {} }) => {
  const [value, setValue] = useState<EDataRange>(defaultValue);

  const triggerChange = (val: EDataRange) => {
    const range = DATE_RANGE_MAP[val];
    onChange?.({ startDate: range.startDate, endDate: range.endDate });
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Segmented: {
            trackBg: '#f5f5f5',
            itemSelectedBg: '#ffffff',
            itemSelectedColor: '#2A69FF',
          },
        },
      }}
    >
      <Segmented
        className={styles.dateRangeSegmented}
        options={[
          { label: '全部', value: EDataRange.all },
          { label: '7日过期', value: EDataRange['7d'] },
          { label: '30日过期', value: EDataRange['30d'] },
        ]}
        value={value}
        onChange={(val: EDataRange) => {
          const newVal = val;
          setValue(newVal);
          triggerChange(newVal);
        }}
        size="middle"
        style={{ ...style }}
      />
    </ConfigProvider>
  );
};

export default DateRangeTabs;
