import { Col, Form, FormItemProps, Row } from 'antd';
import React, { useMemo } from 'react';

import { ColProps } from 'antd/lib';
import { SelectFileData } from '../select-file-data/SelectFileData';
import { SelectPublicData } from '../select-public-data/SelectPublicData';
import Style from './SelectTrainingData.module.scss';
import { basicConfigLayout } from '@llama-fa/constants';
import { cxb } from '@llama-fa/utils';

const cx = cxb.bind(Style);

export const SelectTrainingData = React.memo((props: { colProps?: ColProps; gutter?: number }) => {
  const { colProps, gutter } = props;

  const doubleColProps = useMemo(() => {
    if (!colProps) return;

    return Object.fromEntries(Object.entries(colProps).map(([key, value]) => [key, value * 2]));
  }, [colProps]);

  const commonExtraProps = useMemo(() => {
    const extraItemProps: FormItemProps = {
      className: cx('select-training-data-item'),
    };
    return extraItemProps;
  }, []);

  return (
    <Col {...doubleColProps}>
      <Form.Item label="训练数据">
        <Row gutter={gutter} wrap={false}>
          {basicConfigLayout.publicData ? (
            <Col flex={'50%'}>
              <SelectPublicData
                schema={{
                  ...basicConfigLayout.publicData,
                  extraItemProps: commonExtraProps,
                }}
              />
            </Col>
          ) : null}
          {basicConfigLayout.fileData ? (
            <Col flex={'50%'}>
              <SelectFileData
                schema={{
                  ...basicConfigLayout.fileData,
                  extraItemProps: commonExtraProps,
                }}
              />
            </Col>
          ) : null}
        </Row>
      </Form.Item>
    </Col>
  );
});
