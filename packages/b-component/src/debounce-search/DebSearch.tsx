import React, { useState, useEffect, useRef, useCallback } from "react";
import { Input, InputProps } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import styles from './DebSearch.module.scss';

export interface DebounceSearchProps extends InputProps {
  placeholder?: string;
  allowClear?: boolean;
  size?: 'large' | 'middle' | 'small';
  defaultValue?: string;
  delay?: number;
  onSearch?: (value: string) => void;
  style?: React.CSSProperties;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DebounceSearch: React.FC<DebounceSearchProps> = ({
  placeholder = "请输入搜索内容",
  allowClear = true,
  size = "middle",
  defaultValue = "",
  delay = 500,
  onSearch,
  style,
  onChange,
  className,
  value,
  ...otherProps
}) => {
  const [searchText, setSearchText] = useState<string>(defaultValue);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 防抖处理函数
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchText(value);
      onChange?.(e);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        onSearch?.(value);
      }, delay);
    },
    [delay, onSearch]
  );

  // 搜索按钮点击处理
  const handleSearch = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    onSearch?.(searchText);
  }, [searchText, onSearch]);

  // 组件卸载时清除定时器
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <Input
      placeholder={placeholder}
      allowClear={allowClear}
      size={size}
      value={value || searchText}
      onChange={handleInputChange}
      style={style}
      className={className}
      suffix={
        <SearchOutlined
          className={styles.searchIcon}
          onClick={() => handleSearch()}
        />
      }
      {...otherProps}
    />
  );
};
