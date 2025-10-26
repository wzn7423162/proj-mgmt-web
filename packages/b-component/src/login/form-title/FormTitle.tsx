import React from 'react';
import Style from './FormTitle.module.scss';
import { cxb } from '@llama-fa/utils';

const cx = cxb.bind(Style);

export const FormTitle = React.memo((props: { title: string }) => {
  const { title } = props;

  return <div className={cx('form-title')}>{title}</div>;
});
