import { Col, Collapse, CollapseProps, Row } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { useGetState, useMemoizedFn } from 'ahooks';

import { EFinetuneMode } from '@llama-fa/types';
import { IProfessionalFormProps } from './types';
import Panel from 'antd/es/splitter/Panel';
import { ProForm } from '@ant-design/pro-components';
import React from 'react';
import { SchemaFormItem } from '@/form-item/schema-form-item/SchemaFormItem';
import Style from './TrainigConfig.module.scss';
import { advancedConfigLayout } from '@llama-fa/constants';
import { cxb } from '@llama-fa/utils';
import { groupByFinetuneLayout } from '@llama-fa/core/utils';
import { useFormCommonProps } from '@/finetune-form/hooks/useFormCommonProps';
import { useMemo } from 'react';
import { useState } from 'react';

const cx = cxb.bind(Style);

export const ProfessionalForm = React.memo<IProfessionalFormProps>((props) => {
  const { form, mode, layoutSchema, onValuesChange } = props;

  const { formProps } = useFormCommonProps();

  const groupByLayout = useMemo(() => {
    return groupByFinetuneLayout(layoutSchema);
  }, [layoutSchema]);

  return (
    <div className={cx('professional-form')}>
      {Object.entries(groupByLayout).map(([groupKey, groupByItem], index) => {
        if (groupByItem.items.every((item) => item.extraItemProps?.hidden)) return null;

        const items: CollapseProps['items'] = [
          {
            key: groupKey,
            label: groupByItem.groupName,
            children: (
              <ProForm<{}>
                {...formProps}
                layout="vertical"
                form={form}
                onValuesChange={onValuesChange}
              >
                {groupByItem.items.map((item) => (
                  <Col
                    key={item.param_key}
                    {...(item.extraItemProps?.hidden ? { xs: 0 } : formProps.colProps)}
                  >
                    <SchemaFormItem {...item} mode={mode} />
                  </Col>
                ))}
              </ProForm>
            ),
          },
        ];

        return (
          <Collapse
            key={groupKey}
            className={cx('group')}
            items={items}
            destroyOnHidden={false}
            defaultActiveKey={index ? [] : [groupKey]}
            style={{ width: '100%' }}
          />
        );
      })}
    </div>
  );
});
