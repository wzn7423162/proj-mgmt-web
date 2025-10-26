import { Col, FormInstance } from 'antd';
import { PREDICT_TASK_ID_SCHEMA, basicConfigLayout } from '@llama-fa/constants';
import { ProForm, ProFormDependency, ProFormProps, ProFormText } from '@ant-design/pro-components';

import { ITuneItem } from '@llama-fa/types';
import { ModelSelect } from '@/model-select/ModelSelect';
import React from 'react';
import { SchemaFormItemWrapper } from '@/form-item/schema-form-item/FormItemWrapper';
import { SelectFileData } from '../select-file-data/SelectFileData';
import { SelectPublicData } from '../select-public-data/SelectPublicData';
import Style from './BasicEvaluateConfig.module.scss';
import { cxb } from '@llama-fa/utils';
import { useEvaluatePresenter } from '../../context/EvaluateContext';
import { useFinetuneList } from '@/hooks/useFinetuneList';
import { useFormCommonProps } from '@/finetune-form/hooks/useFormCommonProps';

const cx = cxb.bind(Style);

const BaseModelName = React.memo((params: { taskId: string }) => {
  const { taskId } = params;
  const { selectedFinetuneTask } = useFinetuneList({ fullFormData: { taskId } });

  if (selectedFinetuneTask?.tuneType !== 'lora') {
    return null;
  }

  return (
    <ProFormText
      label="基模型"
      fieldProps={{ value: selectedFinetuneTask?.templateName, disabled: true }}
    />
  );
});

export interface IBasicEvaluateConfigProps<T extends Record<string, any> = Record<string, any>> {
  form?: FormInstance<T>;
  onValuesChange?: ProFormProps['onValuesChange'];
}

export const BasicEvaluateConfig = React.memo<IBasicEvaluateConfigProps>(
  (props: IBasicEvaluateConfigProps) => {
    const { form, onValuesChange } = props;

    const { formProps } = useFormCommonProps();

    return (
      <div className={cx('basic-config')}>
        <ProForm<{}> {...formProps} layout="vertical" form={form} onValuesChange={onValuesChange}>
          <Col {...formProps.colProps}>
            <SchemaFormItemWrapper {...PREDICT_TASK_ID_SCHEMA}>
              <ModelSelect />
            </SchemaFormItemWrapper>
          </Col>
          <ProFormDependency name={['taskId']}>
            {(values) => {
              return <BaseModelName taskId={values.taskId} />;
            }}
          </ProFormDependency>
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
        </ProForm>
      </div>
    );
  }
);
