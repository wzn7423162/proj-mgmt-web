import { AuthUtils, cxb } from '@llama-fa/utils';
import {
  EMPTY_PASSWORD_ERROR_TEXT,
  INVALID_PASSWORD_ERROR_TEXT,
  RESET_PASSWORD_PLACEHODER,
} from '@llama-fa/constants';
import { Form, Input, InputProps } from 'antd';

import { IBaseLoginFormInput } from './types';
import React from 'react';
import Style from './SMSInput.module.scss';

const cx = cxb.bind(Style);

export interface IPasswordInputProps extends IBaseLoginFormInput {
  placeholder?: string;
}

export const PasswordInput = React.memo<IPasswordInputProps>((props) => {
  const { formItemProps, placeholder, ...restProps } = props;

  return (
    <Form.Item
      name="password"
      required
      validateTrigger="onBlur"
      {...formItemProps}
      rules={[
        {
          validator: (rule, value) => {
            if (!value) {
              return Promise.reject(EMPTY_PASSWORD_ERROR_TEXT);
            }

            // const valid = AuthUtils.isReqularPassword(value);

            // if (!valid) {
            //   return Promise.reject(INVALID_PASSWORD_ERROR_TEXT);
            // }

            return Promise.resolve();
          },
        },
      ]}
    >
      <Input.Password
        className={cx('sms-input', 'form-input')}
        placeholder={placeholder || RESET_PASSWORD_PLACEHODER}
        autoComplete="custom-password"
        {...restProps}
      />
    </Form.Item>
  );
});
