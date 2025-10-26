import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { useGetState, useMemoizedFn } from 'ahooks';

import { Col } from 'antd';
import { IQuickFormProps } from './types';
import { ITrainSchemaItem } from '@llama-fa/types';
import { ProForm } from '@ant-design/pro-components';
import React from 'react';
import { SchemaFormItem } from '@/form-item/schema-form-item/SchemaFormItem';
import Style from './TrainigConfig.module.scss';
import { advancedConfigLayout } from '@llama-fa/constants';
import { cxb } from '@llama-fa/utils';
import { useEffect } from 'react';
import { useFormCommonProps } from '@/finetune-form/hooks/useFormCommonProps';
import { useState } from 'react';

const cx = cxb.bind(Style);

const computeQuickFormLayout = (layout: ITrainSchemaItem[], expand: boolean) => {
  if (expand) {
    return layout;
  }

  return layout.map((item, index) => {
    return {
      ...item,
      extraItemProps: {
        ...item.extraItemProps,
        hidden: index > 3,
      },
    };
  });
};

export const QuickForm = React.memo<IQuickFormProps>((props) => {
  const {
    form,
    expanded: quickFormExpanded,
    layoutSchema,
    mode,
    onExpandChange,
    onValuesChange,
  } = props;

  const [formLayout, setFormLayout] = useState(() => layoutSchema);

  const { formProps } = useFormCommonProps();

  // const toggleExpand = useMemoizedFn(() => {
  //   const nextExpanded = !quickFormExpanded;

  //   onExpandChange(nextExpanded);
  // });

  // useEffect(() => {
  //   setFormLayout(computeQuickFormLayout(layoutSchema, quickFormExpanded));
  // }, [layoutSchema, quickFormExpanded]);

  return (
    <>
      <ProForm<{}> {...formProps} layout="vertical" form={form} onValuesChange={onValuesChange}>
        {layoutSchema.map((item) => (
          <Col
            key={item.param_key}
            {...(item.extraItemProps?.hidden ? { xs: 0 } : formProps.colProps)}
          >
            <SchemaFormItem {...item} mode={mode} />
          </Col>
        ))}
      </ProForm>
      {/* <div className={cx('bottom-area')}>
        <div
          className={cx('expand-button', { expanded: quickFormExpanded })}
          onClick={toggleExpand}
        >
          <span className={cx('expand-button-text')}>更多参数</span>
          {quickFormExpanded ? <UpOutlined /> : <DownOutlined />}
        </div>
      </div> */}
    </>
  );
});
