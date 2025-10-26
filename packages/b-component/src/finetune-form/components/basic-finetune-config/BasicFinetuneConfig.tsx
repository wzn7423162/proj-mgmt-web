import { Col, Form, FormInstance } from 'antd';
import { ProForm, ProFormProps } from '@ant-design/pro-components';

import { ITrainSchemaItem } from '@llama-fa/types';
import React from 'react';
import { SchemaFormItem } from '@/form-item/schema-form-item/SchemaFormItem';
import { SelectFileData } from '../select-file-data/SelectFileData';
import { SelectModelList } from '../select-model-list/SelectModelList';
import { SelectPublicData } from '../select-public-data/SelectPublicData';
import { SelectTrainingData } from '../select-training-data/SelectTrainingData';
import Style from './BasicFinetuneConfig.module.scss';
import { basicConfigLayout } from '@llama-fa/constants';
import { cxb } from '@llama-fa/utils';
import { useFormCommonProps } from '@/finetune-form/hooks/useFormCommonProps';

const cx = cxb.bind(Style);

export interface IBasicFinetuneConfigProps<T extends Record<string, any> = Record<string, any>> {
  form?: FormInstance<T>;
  layoutSchema?: ITrainSchemaItem[];
  onValuesChange?: ProFormProps['onValuesChange'];
}

export const BasicFinetuneConfig = React.memo<IBasicFinetuneConfigProps>(
  (props: IBasicFinetuneConfigProps) => {
    const { form, layoutSchema, onValuesChange } = props;

    const { formProps } = useFormCommonProps();

    return (
      <div className={cx('basic-config')}>
        <ProForm<{}> {...formProps} layout="vertical" form={form} onValuesChange={onValuesChange}>
          {basicConfigLayout.modelName ? (
            <Col {...formProps.colProps}>
              <SelectModelList schema={basicConfigLayout.modelName} />
            </Col>
          ) : null}
          {basicConfigLayout.publicData ? (
            <Col {...formProps.colProps}>
              <SelectPublicData schema={basicConfigLayout.publicData} />
            </Col>
          ) : null}
          {basicConfigLayout.fileData ? (
            <Col {...formProps.colProps}>
              <SelectFileData schema={basicConfigLayout.fileData} />
            </Col>
          ) : null}
          {/* <SelectTrainingData
            colProps={formProps.colProps}
            gutter={(formProps.rowProps?.gutter as any)?.[0]}
          /> */}
          {layoutSchema?.length
            ? layoutSchema.map((item) => (
                <Col
                  key={item.param_key}
                  {...formProps.colProps}
                  {...(item.extraItemProps?.hidden ? { xs: 0 } : formProps.colProps)}
                >
                  <SchemaFormItem {...item} />
                </Col>
              ))
            : null}
        </ProForm>
      </div>
    );
  }
);
