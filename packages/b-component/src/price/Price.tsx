import React, { FC, memo, useMemo } from 'react';

import classNames from 'classnames';
import { formatAmount } from '@llama-fa/utils';
import s from './Price.module.scss';

const sizeMap = {
  small: 16,
  medium: 20,
  large: 32,
};

export interface ILPriceProps {
  style?: React.CSSProperties;
  className?: string;
  value?: number | string;
  unit?: string | boolean;
  size?: number;
  bold?: boolean;
  /**
   * 金钱符号的样式
   */
  symbolStyle?: React.CSSProperties;
  /**
   * 单位是否带颜色
   */
  unitColor?: boolean;
  /**
   * 字体颜色
   */
  color?: string | false;
  /**
   * 保留金额后几位
   */
  retainDecimal?: number;
  /**
   * 金额单位的样式
   */
  unitStyle?: React.CSSProperties;

  /** 金额单位是否显示 */
  unitVisible?: boolean;
}

export const LPrice: FC<ILPriceProps> = memo((props) => {
  const {
    style,
    className,
    value = 0,
    bold,
    size = 24,
    unit = '小时',
    unitColor = true,
    symbolStyle,
    color = '#2A69FF',
    retainDecimal = 4,
    unitStyle,
    unitVisible = true,
    ...rest
  } = props;

  return (
    <span className={classNames(s.price, className)} style={{ ...style, color: color || '' }}>
      <span
        style={{ fontSize: size }}
        className={classNames(s.priceValue, {
          [s.bold]: bold,
        })}
      >
        {value === undefined ? null : (
          <span>
            {unitVisible && (
              <span className={s.unitText} style={symbolStyle}>
                ¥
              </span>
            )}

            <span>{formatAmount(Number(value), retainDecimal)}</span>
          </span>
        )}
      </span>
      {unit && (
        <span style={{ color: unitColor ? 'unset' : '#333', ...unitStyle }} className={s.priceUnit}>
          /{unit}
        </span>
      )}
    </span>
  );
});
