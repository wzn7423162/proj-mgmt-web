import { Button, Modal, Tooltip } from 'antd';
import React, { useMemo } from 'react';
import { cxb, getTimeDiffText } from '@llama-fa/utils';

import { DynamicDiscountDetail } from '../dynamic-discount-detail/DynamicDiscountDetail';
import { ETaskMode } from '@llama-fa/types';
import HOURGLASS_IMG from '@llama-fa/constants/assets/images/finetune/hourglass.png';
import { LDialog } from '@/dialog/Dialog';
import { LIcon } from '@/icon/Icon';
import { LPrice } from '@/price/Price';
import PERCENT_IMG from '@llama-fa/constants/assets/images/finetune/percent.png';
import ROCKET_IMG from '@llama-fa/constants/assets/images/finetune/rocket.png';
import Style from './TaskPriceCard.module.scss';
import dayjs from 'dayjs';
import { useMemoizedFn } from 'ahooks';

const cx = cxb.bind(Style);

const PRESET_MAPPING: Record<
  ETaskMode,
  {
    img: string;
    title: string;
    explain: string;
    containerClassName: string;
  }
> = {
  [ETaskMode.fast]: {
    img: ROCKET_IMG,
    title: '极速尊享',
    explain: '优先使用算力资源，无需长时等待立即开始训练任务',
    containerClassName: 'fast',
  },
  [ETaskMode.queue]: {
    img: HOURGLASS_IMG,
    title: '动态优惠',
    explain: '资源紧张时排队，多因素优惠计价',
    containerClassName: 'queue',
  },
  // [ETaskMode.longQueue]: {
  //   img: CLOCK_IMG,
  //   title: '长时省享',
  //   explain: '1~5小时算力资源排队，等待5小时以内开始训练任务',
  //   containerClassName: 'longQueue',
  // },
  [ETaskMode.dynamic]: {
    img: PERCENT_IMG,
    title: '灵动超省',
    explain: '超高折扣，算力使用优先级低，资源不足时会停止任务',
    containerClassName: 'dynamic',
  },
};

export interface ICardItemProps {
  mode: ETaskMode;
  disabled?: boolean;
  selected?: boolean;
  discount?: string;
  minDuration?: number;
  maxDuration?: number;
  price?: number;
  hiddenDetail?: boolean;
  showDynamicPriceDetail?: boolean;
  onClick?: (mode: ETaskMode) => void;
}

export const TaskPriceCard = React.memo((props: ICardItemProps) => {
  const {
    mode,
    disabled,
    selected,
    minDuration,
    maxDuration,
    discount,
    price,
    hiddenDetail,
    showDynamicPriceDetail = false,
    onClick,
  } = props;

  const preset = PRESET_MAPPING[mode];

  const queueText = useMemo(() => {
    let resultText = '';
    const now = Date.now();
    let minExecuteTimeText =
      typeof minDuration === 'number' ? dayjs(+now + minDuration).diff(now, 'minute') : '';
    let maxExecuteTimeText =
      typeof maxDuration === 'number' ? dayjs(+now + maxDuration).diff(now, 'minute') : '';

    resultText += minExecuteTimeText;

    if (minExecuteTimeText && maxExecuteTimeText) {
      resultText += '~' + maxExecuteTimeText;
    }

    if (!resultText) {
      resultText = '--';
    }

    return (resultText += '分钟');
  }, [minDuration, maxDuration]);

  const handleClick = useMemoizedFn(() => {
    if (disabled) return;
    onClick?.(mode);
  });

  const validDiscountNumber = useMemo(() => {
    const discountNumber = Number(discount);

    if (!discountNumber || discountNumber === 10) return undefined;

    return discountNumber;
  }, [discount]);

  const discountText = useMemo(() => {
    if (!validDiscountNumber) return '--';

    return validDiscountNumber.toFixed(2) + '折';
  }, [validDiscountNumber]);

  const titleDiscountLabel = useMemo(() => {
    if (mode === ETaskMode.fast) {
      return <span className={cx('discount-mark')}>快速开始</span>;
    }

    // if (!validDiscountNumber) return null;

    if (mode === ETaskMode.queue) {
      return <span className={cx('discount-mark', 'arrow-mark')}>低至5折</span>;
    }

    if (mode === ETaskMode.dynamic) {
      return <span className={cx('discount-mark', 'arrow-mark')}>2.5~5折</span>;
    }
  }, [validDiscountNumber, discountText, mode]);

  if (!preset) return null;

  return (
    <div
      className={cx('task-price-item', { selected, disabled }, preset.containerClassName)}
      onClick={handleClick}
    >
      <div className={cx('background')}>
        <img className={cx('task-image')} src={preset.img} />
      </div>
      <div className={cx('content')}>
        <div>
          <div className={cx('title')}>
            <span className={cx('title-text')}>{preset.title}</span>
            {titleDiscountLabel}
          </div>
          <div className={cx('explain')}>
            {preset.explain}
            {showDynamicPriceDetail ? (
              <LDialog
                width={640}
                centered
                title="动态优惠说明"
                cancelButtonProps={{ style: { display: 'none' } }}
                okText="知道了"
                body={<DynamicDiscountDetail />}
              >
                <Tooltip title="动态优惠说明">
                  <span>
                    <LIcon size={14} type="tixing" className={cx('dynamic-price-detail')} />
                  </span>
                </Tooltip>
              </LDialog>
            ) : null}
          </div>
        </div>
        {hiddenDetail ? null : (
          <div className={cx('price-detail')}>
            <div className={cx('detail-item', 'queue-duration')}>
              <span className={cx('label')}>排队时长</span>
              <span className={cx('value')}>{queueText}</span>
            </div>
            <div className={cx('detail-item', 'discount')}>
              <span className={cx('label')}>优惠折扣</span>
              <span className={cx('value')}>{discountText}</span>
            </div>
            <div className={cx('detail-item', 'price')}>
              <span className={cx('label')}>预估价格</span>
              <span className={cx('value')}>
                {price ? (
                  <LPrice
                    value={price.toFixed(2)}
                    size={14}
                    unit="卡/小时"
                    color="#F5222D"
                    symbolStyle={{ fontSize: 13, color: '#F5222D' }}
                    unitStyle={{ fontSize: 14, color: '#F5222D' }}
                  />
                ) : (
                  '--'
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
