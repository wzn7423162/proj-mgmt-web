import React, { FC, memo } from 'react';

import { ITuneItem } from '@llama-fa/types';
import classNames from 'classnames';
import { isBuiltLora } from '../utils/common';
import s from './FreeTip.module.scss';

export interface IFreeTipProps {
  tuneItem: ITuneItem;
  style?: React.CSSProperties;
  className?: string;
  text?: string;
}

export const FreeTip: FC<IFreeTipProps> = memo((props) => {
  const { tuneItem, className, style, text = 'LoRA模型对话限时免费' } = props;
  if (isBuiltLora(tuneItem)) {
    return (
      <div style={style} className={classNames(s.tip, className)}>
        {text}
      </div>
    );
  }
  return null;
});
