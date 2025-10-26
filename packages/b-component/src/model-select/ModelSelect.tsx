import React, { FC, useEffect, useState } from 'react';
import { Select, Space, Tooltip } from 'antd';

import { ITuneItem } from '@llama-fa/types';
import frazzeIconf from '@llama-fa/constants/assets/images/chat/frazze.png';
import { isBuiltLora, isMergeModel } from '../utils/common';
import loarIconf from '@llama-fa/constants/assets/images/chat/loar.png';
import s from './ModelSelect.module.scss';
import { useFinetuneList } from '@/hooks/useFinetuneList';
import { debounce } from 'lodash';

export interface IModelSelectProps {
  width?: string | number;
  dropdownWidth?: string | number;
  value?: string;
  disabled?: boolean;
  onChange?: (value: string, data: ITuneItem) => void;
}

export const ModelSelect: FC<IModelSelectProps> = (props) => {
  const { value, onChange, width = 315, dropdownWidth = 455, disabled } = props;
  const [currValue, setCurrValue] = useState(value);

  const [searchValue, setSearchValue] = useState<string>();
  const { finetuneList: data, restQuery } = useFinetuneList({ taskName: searchValue });

  useEffect(() => {
    setCurrValue(value);
  }, [value, data]);

  const list = data?.list || [];

  const handleChange = (value: string) => {
    const item = list?.find((item) => item.id === value);
    onChange?.(value, item!);
    setCurrValue(value);
  };

  const handleDebounceSearch = debounce((value) => {
    setSearchValue(value);
  }, 500);

  return (
    <Select
      disabled={disabled}
      value={currValue}
      // style={{ width: 315 }}
      dropdownStyle={{ width: dropdownWidth }}
      onChange={handleChange}
      loading={restQuery.isLoading}
      optionLabelProp="label"
      placeholder="请选择微调后的模型"
      showSearch
      filterOption={false}
      onSearch={handleDebounceSearch}
    >
      {list?.map((item) => (
        <Select.Option key={item.id} value={item.id} label={item?.taskName || ''}>
          <div className={s.option}>
            <Tooltip title={item.tuneType === 'lora' ? 'LoRA模型' : '全量模型'}>
              <img
                style={{ width: 24, height: 24 }}
                src={item.tuneType === 'lora' ? loarIconf : frazzeIconf}
                alt={item.tuneType === 'lora' ? 'lora' : 'frazze'}
              />
            </Tooltip>

            <span className={s.taskName}>
              {item?.taskName || ''}
              {isMergeModel(item) && <span className={s.mergedTag}>(merged)</span>}
            </span>

            {isBuiltLora(item) && <div className={s.name}>限时免费</div>}
          </div>
        </Select.Option>
      ))}
    </Select>
  );
};
