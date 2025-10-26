import { Form, Input, InputProps } from 'antd';

import { AuthUtils } from '@llama-fa/utils';
import { IBaseLoginFormInput } from './types';
import React from 'react';

export interface IPhoneInputProps extends IBaseLoginFormInput {}

export const PhoneInput = React.memo<IPhoneInputProps>((props) => {
  const { formItemProps, ...restProps } = props;
  return (
    <Form.Item
      name="phone"
      validateTrigger={['onBlur', 'onChange']}
      rules={[
        {
          validator: (rule, value) => {
            value = value?.trim();

            if (!value) {
              return Promise.reject(new Error('请输入手机号'));
            }

            if (!AuthUtils.isRegularPhone(value)) {
              return Promise.reject(new Error('手机号不正确，请输入正确手机号'));
            }

            return Promise.resolve();
          },
        },
      ]}
      {...formItemProps}
    >
      <Input allowClear type="text" placeholder="请输入手机号" {...restProps} />
    </Form.Item>
  );
});
