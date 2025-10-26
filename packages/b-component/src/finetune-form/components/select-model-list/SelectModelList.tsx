import { ProFormSelect, ProFormSelectProps } from '@ant-design/pro-components';
import React, { useState } from 'react';

import { ITrainSchemaItem } from '@llama-fa/types';
import { SchemaFormItem } from '@/form-item/schema-form-item/SchemaFormItem';
import { useBaseModelList } from '@llama-fa/core/hooks';
import { useFinetunePresenter } from '../../context/FinetaneContext';
import { useMemo } from 'react';

export enum ETrainDataType {
  public = 'public',
  file = 'file',
}

export interface ISelectModelListProps {
  schema: ITrainSchemaItem;
}

export const SelectModelList = React.memo<ISelectModelListProps>((props) => {
  const { schema } = props;

  const { baseModelList } = useBaseModelList();

  const composedProps = useMemo(() => {
    const enum_options: ITrainSchemaItem['enum_options'] =
      baseModelList?.list.map((item: any) => ({
        name: item.modelName,
        value: item.id,
      })) ?? [];

    return {
      ...schema,
      enum_options,
      extraFieldProps: { showSearch: true },
    };
  }, [baseModelList, schema]);

  return <SchemaFormItem {...composedProps} />;
});
