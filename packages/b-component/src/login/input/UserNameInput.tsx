import { Form, FormItemProps, Input, InputProps } from 'antd';

import { AuthUtils } from '@llama-fa/utils';
import { IBaseLoginFormInput } from './types';
import React from 'react';

export interface IUserNameInputProps extends IBaseLoginFormInput {}

export const UserNameInput = React.memo<IUserNameInputProps>((props) => {
  const { formItemProps, ...restProps } = props;

  return (
    <Form.Item
      name="userName"
      required
      {...formItemProps}
      rules={[
        {
          validator: (rule, value) => {
            const valid = AuthUtils.isReqularUserName(value);

            if (!valid) {
              return Promise.reject('请输入4-12位数字、字母的用户名');
            }

            return Promise.resolve();
          },
        },
      ]}
    >
      <Input placeholder="请输入用户名" {...restProps} />
    </Form.Item>
  );
});
