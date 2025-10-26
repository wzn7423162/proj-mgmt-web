import { EFinetuneMode, ITrainSchemaItem } from '@llama-fa/types';

import { FormItemProps } from 'antd';

export interface ISchemaFormItemProps
  extends Omit<
    ITrainSchemaItem,
    'group_key' | 'default_value' | 'value_as_cmd' | 'is_quick' | 'is_estimator'
  > {
  mode?: EFinetuneMode;
}

export interface ISchemaFormItemRenderProps extends ISchemaFormItemProps {
  value?: any;
  onChange?: (value: any) => void;
}
