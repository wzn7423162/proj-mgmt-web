import {
  Flex,
  Form,
  FormItemProps,
  Input,
  InputNumber,
  InputNumberProps,
  Select,
  Slider,
  Switch,
} from 'antd';
import { IUseFormItemProps, useFormItemProps } from './hooks/useFormItemProps';
import React, { PropsWithChildren, useMemo } from 'react';

import { ISchemaFormItemRenderProps } from './types';
import { ProFormItem } from '@ant-design/pro-components';
import Style from './SchemaFormItem.module.scss';
import { cxb } from '@llama-fa/utils';
import { useMemoizedFn } from 'ahooks';

const cx = cxb.bind(Style);

export const SchemaFormItemWrapper = React.memo<PropsWithChildren<IUseFormItemProps>>((props) => {
  const { extraItemProps, children } = props;

  const formItemProps = useFormItemProps(props);

  return (
    <Form.Item {...formItemProps} {...extraItemProps}>
      {children}
    </Form.Item>
  );
});
