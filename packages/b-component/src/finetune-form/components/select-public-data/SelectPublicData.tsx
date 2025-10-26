import React, { useMemo, useState } from 'react';

import { ITrainSchemaItem } from '@llama-fa/types';
import { SchemaFormItem } from '@/form-item/schema-form-item/SchemaFormItem';
import { usePublicDataList } from '@/finetune-form/hooks/usePublicDataList';

export enum ETrainDataType {
  public = 'public',
  file = 'file',
}

export interface ISelectPublicDataProps {
  schema: ITrainSchemaItem;
}

export const SelectPublicData = React.memo<ISelectPublicDataProps>((props) => {
  const { schema } = props;

  const { publicDatas } = usePublicDataList();

  const composedProps = useMemo(() => {
    const enum_options: ITrainSchemaItem['enum_options'] =
      publicDatas?.list.map((item: any) => ({
        name: item.name,
        value: item.name,
      })) ?? [];

    return {
      ...schema,
      enum_options,
      extraFieldProps: {
        mode: 'multiple',
      },
    };
  }, [publicDatas, schema]);

  return <SchemaFormItem {...composedProps} />;
});
