import React, { FC, memo } from 'react';
import Styles from './RichRender.module.scss'
import { cxb } from '@llama-fa/utils';
const cb = cxb.bind(Styles)


export interface IRichRenderProps {
  html: string;
  style?: React.CSSProperties;
  className?: string;
}

export const RichRender: FC<IRichRenderProps> = memo((props) => {
  const { html, style, className } = props;
  return (
    <div
      className={cb('ql-editor', 'rich-render-container', className)}
      style={style}
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  );
});
