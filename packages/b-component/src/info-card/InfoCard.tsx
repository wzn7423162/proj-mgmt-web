import React from 'react';
import Style from './InfoCard.module.scss';
import { cxb } from '@llama-fa/utils';

const cx = cxb.bind(Style);

interface IInfoCardProps {
  borderRadius?: 'both' | 'right' | 'left' | 'bottom' | 'top';
  children: React.ReactNode;
  pd?: number;
}

export const InfoCard = (props: IInfoCardProps) => {
  const { children, borderRadius = 'both', pd } = props;
  return <div className={cx('info-card-contain', borderRadius)} style={{padding: `${pd}px`}}>{children}</div>;
};
