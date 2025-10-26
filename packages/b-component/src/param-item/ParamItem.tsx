import React, { useMemo, useState } from 'react';
import { Col, Typography } from 'antd';
import styles from './ParamItem.module.scss';
import { LTitle } from '@llama-fa/component';
import { Grid } from 'antd';
import { useMediaQuery } from '@llama-fa/utils'


export interface ParamItemProps {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  renderValue?: () => React.ReactNode;
  span?: number;
}

export const ParamItem: React.FC<ParamItemProps> = ({
  label,
  value,
  span,
  style,
  renderValue,
}) => {

  const isXXXL = useMediaQuery();
  const screens = Grid.useBreakpoint();


  const flexSpan = useMemo(() => {
    // For screens wider than 2200px, show 6 items per row (span=4)
    if (isXXXL) {
      return 4;
    }
    // 在超大屏上（>=1600px），span 为 6，一行恰好放下4项
    if (screens.xxl) {
      return 6;
    }
    // 在大屏上（>=992px），span 为 6，一行恰好放下4项
    if (screens.lg) {
      return 8;
    }
    if (screens.md) {
      return 12;
    }
    if (screens.sm) {
      return 12;
    }
    return 24;
  }, [isXXXL, screens]);

  return (
    <Col style={style} span={span ?? flexSpan}>
      <LTitle>{label} :</LTitle>
      {renderValue ? renderValue() : <LTitle> {value}</LTitle>}
    </Col>
  );
};
