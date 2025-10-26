import { EFinetuneMode, ITrainSchemaItem } from '@llama-fa/types';

import { FormInstance } from 'antd';
import { ProFormProps } from '@ant-design/pro-components';

export interface ITrainigConfigProps<T extends Record<string, any> = Record<string, any>> {
  form?: FormInstance<T>;
  mode: EFinetuneMode;
  layoutSchema: ITrainSchemaItem[];
  onValuesChange?: ProFormProps['onValuesChange'];
}

export interface IQuickFormProps extends ITrainigConfigProps {
  expanded: boolean;
  onExpandChange: (expanded: boolean) => void;
}

export interface IProfessionalFormProps extends ITrainigConfigProps {}
