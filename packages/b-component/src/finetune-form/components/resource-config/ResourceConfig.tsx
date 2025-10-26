import { Col, Form, FormInstance, Row } from 'antd';
import {
  EScenarioType,
  GPU_COUNT_NAME_KEY,
  IServerRuleEntity,
  SERVER_QUERY_KEY,
  SERVER_RULE_KEY,
  TRAINING_GPU_COUNT_OPTIONS,
} from '@llama-fa/constants';
import {
  ProForm,
  ProFormDigit,
  ProFormProps,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';

import { ITuneItem } from '@llama-fa/types';
import React from 'react';
import { ResourceInfoCard } from '../resouce-info-card/ResourceInfoCard';
import Style from './ResourceConfig.module.scss';
import { cxb } from '@llama-fa/utils';
import { isBuiltLora } from '@/utils/common';
import { useFormCommonProps } from '@/finetune-form/hooks/useFormCommonProps';
import { useGPURule } from '@/finetune-form/hooks/useGPURule';

const cx = cxb.bind(Style);

export interface IResourceConfigProps<T extends Record<string, any> = Record<string, any>> {
  form?: FormInstance<T>;
  tuneItem?: ITuneItem;
  onValuesChange?: ProFormProps['onValuesChange'];
}

export const ResourceConfig = React.memo<IResourceConfigProps>((props) => {
  const { form, tuneItem, onValuesChange } = props;

  const GPURule = useGPURule();

  const { formProps } = useFormCommonProps();

  return (
    <div className={cx('resource-config')}>
      <ProForm<{}> layout="vertical" {...formProps} form={form} onValuesChange={onValuesChange}>
        <Col xs={24} className={cx('resource-card-list-col')}>
          <Row>
            <Col flex={'0 0 387px'}>
              <Form.Item layout="vertical" name="aa" label="资源规格">
                <ResourceInfoCard
                  selected
                  price={GPURule?.unitPrice}
                  title={GPURule?.ruleName}
                  cpuCount={GPURule?.cpu}
                  memory={GPURule?.mem}
                />
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <ProFormSelect
          disabled={tuneItem ? isBuiltLora(tuneItem) : false}
          name={GPU_COUNT_NAME_KEY}
          label="GPU卡数"
          colProps={{ flex: '0 0 408px' }}
          valueEnum={TRAINING_GPU_COUNT_OPTIONS}
          // fieldProps={{ defaultValue: 1 }}
          formItemProps={{
            extra: (
              <div className={cx('gpucount-extra-info')}>
                16卡为2个8卡机器，24卡为3个8卡机器，32卡为4个8卡机器
              </div>
            ),
          }}
        />
        <ProFormRadio.Group
          fieldProps={{
            optionType: 'button',
            defaultValue: 'a',
          }}
          colProps={{ flex: 'none' }}
          name="radio-vertical"
          label="付费方式"
          options={[
            {
              label: '按量付费',
              value: 'a',
            },
          ]}
        />
      </ProForm>
    </div>
  );
});
