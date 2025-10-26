import React, { useMemo } from 'react';

import { LPrice } from '@/price/Price';
import Style from './ResourceInfoCard.module.scss';
import { cxb } from '@llama-fa/utils';

const cx = cxb.bind(Style);

export interface IResourceInfoCardProps {
  selected?: boolean;
  title?: string;
  cpuCount?: number;
  memory?: number;
  price?: number;
}

export const ResourceInfoCard = React.memo((props: IResourceInfoCardProps) => {
  const { selected, title, cpuCount, memory, price } = props;

  return (
    <div className={cx('resouce-info-card', { selected })}>
      <div className={cx('content')}>
        <div className={cx('title')}>{title}</div>
        <div className={cx('info-grid')}>
          <div className={cx('grid-item')}>
            <div className={cx('item-label')}>CPU:</div>
            <div className={cx('item-value')}>{cpuCount}cores</div>
          </div>
          <div className={cx('grid-item')}>
            <div className={cx('item-label')}>MEM:</div>
            <div className={cx('item-value')}>{memory}GB</div>
          </div>
        </div>
      </div>
      <div className={cx('price')}>
        <LPrice
          value={price}
          unit="卡/小时"
          color={'#2A69FF'}
          size={20}
          symbolStyle={{
            fontSize: 14,
          }}
          unitStyle={{ color: 'rgba(0,0,0,0.45)', fontSize: 14 }}
        />
      </div>
    </div>
  );
});
