import { Button, ButtonProps } from 'antd';

import React from 'react';
import Style from './GradientButton.module.scss';
import { cxb } from '@llama-fa/utils';
import classNames from 'classnames';

const cx = cxb.bind(Style);

export interface IGradientButtonProps extends Partial<ButtonProps> {
  scene?: 'infer' | 'online';
}

export const GradientButton = React.memo<IGradientButtonProps>((props) => {
  const { children, className, scene = 'online', ...restProps } = props;

  return (
    <Button
      type="primary"
      size="large"
      className={classNames(cx('gradient-button', className), {
        [cx('gradient-button-infer')]: scene === 'infer',
      })}
      {...restProps}
    >
      {children}
    </Button>
  );
});
