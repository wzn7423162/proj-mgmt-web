import { FormItemProps, InputProps } from 'antd';

export interface IBaseLoginFormInput extends Partial<Omit<InputProps, 'onChange'>> {
  formItemProps?: FormItemProps;
}
