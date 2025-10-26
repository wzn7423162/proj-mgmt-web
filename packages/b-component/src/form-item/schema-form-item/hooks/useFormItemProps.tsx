import { Form, Tooltip } from 'antd';
import { ISchemaFormItemProps, ISchemaFormItemRenderProps } from '../types';
import React, { useMemo } from 'react';

import { EDataType } from '@llama-fa/types';
import { LIcon } from '../../../icon/Icon';
import Style from '../SchemaFormItem.module.scss';
import { cxb } from '@llama-fa/utils';

const cx = cxb.bind(Style);

export interface IUseFormItemProps
  extends Pick<
    ISchemaFormItemRenderProps,
    | 'zh_name'
    | 'en_name'
    | 'description'
    | 'param_key'
    | 'required'
    | 'extraItemProps'
    | 'data_type'
  > {}

export const useFormItemProps = (
  props: IUseFormItemProps
): React.ComponentProps<typeof Form.Item> => {
  const { zh_name, en_name, param_key, description, required, data_type, ...restProps } = props;

  const formLabel = useMemo(() => {
    return (
      <div className={cx('form-item-wrap')}>
        {zh_name}
        {description ? (
          <Tooltip className={cx('tooltip')} title={description}>
            <span>
              <LIcon className={cx('tooltip-icon')} type="help" size={'small'} />
            </span>
          </Tooltip>
        ) : null}
        {en_name === 'none' ? null : <span className={cx('en-name')}>{en_name}</span>}
      </div>
    );
  }, [zh_name, en_name, description]);

  const formProps = useMemo(() => {
    const composed: React.ComponentProps<typeof Form.Item> = {
      name: [param_key],
      // required,
      rules: [
        {
          validator: (_, value) => {
            if (value === 0) Promise.resolve();

            if (required) {
              if (!value) {
                return Promise.reject(new Error(`${zh_name}不能为空`));
              }
            }

            return Promise.resolve();
          },
          message: ``,
        },
      ],
      label: formLabel,
    };

    return composed;
  }, [param_key, formLabel, zh_name]);

  return formProps;
};
