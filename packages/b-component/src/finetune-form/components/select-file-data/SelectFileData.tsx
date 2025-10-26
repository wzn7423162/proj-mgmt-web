import React, { useMemo, useRef, useState } from 'react';
import { Select, SelectProps } from 'antd';

import { ITrainSchemaItem } from '@llama-fa/types';
import { SchemaFormItem } from '@/form-item/schema-form-item/SchemaFormItem';
import { SchemaFormItemWrapper } from '@/form-item/schema-form-item/FormItemWrapper';
import { useFilesData } from '@/finetune-form/hooks/useFilesData';

export interface ISelectFilesProps {
  value?: any;
  onChange?: (value: any) => any;
  options: SelectProps['options'];
}

export const SelectFiles = React.memo<ISelectFilesProps>((props) => {
  const { value, options, onChange } = props;

  return <Select mode="multiple" showSearch value={value} options={options} onChange={onChange} />;
});

export interface ISelectFileDataProps {
  schema: ITrainSchemaItem;
}

export const SelectFileData = React.memo<ISelectFileDataProps>((props) => {
  const { schema } = props;

  const { fileDatas, ...rest } = useFilesData();

  // const emptyFilesRemind = useMemo(() => {
  //   return;
  //   return options.length ? undefined : (
  //     <span style={{ color: 'red' }}>数据文件不存在，请重新选择训练数据</span>
  //   );
  // }, [options]);

  const composedProps = useMemo(() => {
    const enum_options: ITrainSchemaItem['enum_options'] =
      fileDatas?.map((item: any) => ({
        name: item,
        value: item,
      })) ?? [];

    return {
      ...schema,
      enum_options,
      extraFieldProps: {
        mode: 'multiple',
      },
    };
  }, [fileDatas, schema]);

  return <SchemaFormItem {...composedProps} />;

  // return (
  //   <SchemaFormItemWrapper
  //     {...schema}
  //     extraItemProps={{
  //       help: emptyFilesRemind,
  //     }}
  //   >
  //     <SelectFiles options={options} />
  //   </SchemaFormItemWrapper>
  // );
});
