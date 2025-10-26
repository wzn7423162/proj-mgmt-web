import { Flex, Popover } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

import React from 'react';
import { cxb } from '@llama-fa/utils';
import Style from './InferPrice.module.scss';
const cx = cxb.bind(Style);

export interface InferPriceProps {
  /** 单价 */
  price?: string | number;
  /** 尺寸 */
  size?: number;
  /** 描述 */
  text?: string;
  /** 提示（传入则覆盖内置；传空禁用） */
  tip?: React.ReactNode | string;
  unit?: string;
  /** 是否为生图场景（不传则根据 unit === '图' 推断） */
  isImage?: boolean;
  /** 推理单价（秒单价） */
  unitPrice?: string | number;
  /** 预估推理时长（图场景用，秒/图） */
  reasoningDuration?: string | number;
}

export const InferPrice: React.FC<InferPriceProps> = ({
  text = '推理单价',
  price = '0.009',
  size = 30,
  unit = '秒',
  tip,
  isImage,
  unitPrice,
  reasoningDuration,
}) => {
  const isImg = typeof isImage === 'boolean' ? isImage : unit === '图';
  const computedUnitPrice = unitPrice ?? (isImg ? 0.045 : 0.009);
  const computedReasoningDuration = reasoningDuration ?? 3;

  const textTip = (
    <div style={{ width: 300 }}>
      <div className={cx('pricingItem')}>
        <div className={cx('pricingTitle')}>推理时长</div>
        <div className={cx('pricingDesc')}>
          模型开始推理至推理结束所需时间，用户发送Prompt至模型开始推理中的等待时间不纳入推理时长。即我们仅收取模型思考期间消耗GPU的费用。
        </div>
      </div>
      <div className={cx('pricingItem')} style={{ marginTop: 16 }}>
        <div className={cx('pricingTitle')}>推理单价</div>
        <div className={cx('pricingDesc')}>推理时长的每秒计费价格。</div>
      </div>
    </div>
  );

  const content2 = (
    <div style={{ width: 300 }}>
      真实测量此模型以迭代步数20生成一张1024*1024尺寸图片的推理时长为{String(computedReasoningDuration)}秒/图
    </div>
  );

  const imageTip = (
    <div>
      <div className={cx('pricingItem')}>
        <div className={cx('pricingTitle')}>
          推理单价：
          <span className={cx('text')}>¥ {computedUnitPrice}</span>
          <span className={cx('text2')}>/ 秒</span>
          <Popover content={textTip} trigger="hover" style={{ marginLeft: 4 }}>
            <InfoCircleOutlined className={cx('footer-icon')} />
          </Popover>
        </div>
      </div>
      <div className={cx('pricingItem')} style={{ marginTop: 16 }}>
        <div className={cx('pricingTitle')}>
          预估时长：
          <span className={cx('text2')}>{String(computedReasoningDuration)}秒 / 图</span>
          <Popover content={content2} trigger="hover" style={{ marginLeft: 4 }}>
            <InfoCircleOutlined className={cx('footer-icon')} />
          </Popover>
        </div>
      </div>
    </div>
  );

  const finalTip = tip ?? (isImg ? imageTip : textTip);

  return (
    <Flex className={cx('infre-price-container')} gap={4} align="center">
      <span>{text}：</span>
      <span className={cx('goods-price')} style={{ fontSize: `${size}px` }}>
        ¥ {price}
      </span>
      <span>/ {unit}</span>
      {finalTip && (
        <Popover content={finalTip} placement="top">
          <InfoCircleOutlined className={cx('footer-icon')} />
        </Popover>
      )}
    </Flex>
  );
};
