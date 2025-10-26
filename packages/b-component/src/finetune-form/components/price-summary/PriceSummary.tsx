import { Button, Col, Divider, Dropdown, Form, FormInstance } from 'antd';
import { ITaskPriceItem, ITuneItem } from '@llama-fa/types';
import { ProForm, ProFormDependency, ProFormProps } from '@ant-design/pro-components';
import React, { useEffect, useMemo } from 'react';
import { cxb, formatAmount, getTimeDiffText } from '@llama-fa/utils';

import { ActionBarDropdownContent } from '../../../action-bar-dropdown-content/ActionBarDropdownContent';
import { FreeTip } from '../../../free-tip/FreeTip';
import { IModelEstimatedTimeResult } from '@llama-fa/core/api';
import { IServerRuleEntity } from '@llama-fa/constants';
import { LIcon } from '../../../icon';
import { LPrice } from '../../../price/Price';
import Style from './PriceSummary.module.scss';
import { UpOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { isBuiltLora } from '../../../utils/common';
import { useGPURule } from '../../hooks/useGPURule';
import { useGlobalPresenter } from '@llama-fa/core/context';
import { useMemoizedFn } from 'ahooks';
import { useState } from 'react';
import { useTotalAmount } from '@llama-fa/core/hooks';

const cx = cxb.bind(Style);

const useEstimatedTimeHours = (estimatedTime?: IModelEstimatedTimeResult) => {
  const estimatedTimeHours = useMemo(() => {
    if (!estimatedTime) return { min: 0, max: 0 };

    const { predict_total_time_sec, predict_total_time_sec_max } = estimatedTime;

    const minHours = Number((predict_total_time_sec / (60 * 60)).toFixed(4));
    const maxHours = Number((predict_total_time_sec_max / (60 * 60)).toFixed(4));
    return {
      min: minHours,
      max: maxHours,
    };
  }, [estimatedTime]);

  return estimatedTimeHours;
};

const GPUCountText = React.memo((props: { value?: number }) => {
  const { value } = props;

  return (
    <div className={cx('info-item', 'gpu-count-text')}>
      <div className={cx('info-label')}>配置资源总数</div>
      <div className={cx('info-value')}>{`H800A（80G）* ${value}`}</div>
    </div>
  );
});

export const EstimatedTimeText = React.memo(
  (props: { estimatedTime?: IModelEstimatedTimeResult }) => {
    const { estimatedTime } = props;
    const { min, max } = useEstimatedTimeHours(estimatedTime);

    const estimatedTimeText = useMemo(() => {
      if (!estimatedTime) return '';

      const minText = min + '小时';
      const maxText = max + '小时';

      return minText + '-' + maxText;
    }, [estimatedTime]);
    return (
      <div className={cx('info-label')}>
        <div className={cx('info-item')}>预估运行时长</div>
        <div style={{ marginTop: 8 }} className={cx('info-value')}>
          {!estimatedTime ? '--' : estimatedTimeText}
        </div>
      </div>
    );
  }
);

export const EstimatedPriceText = React.memo(
  (props: {
    estimatedTime?: IModelEstimatedTimeResult;
    selectedPrice?: ITaskPriceItem;
    gpuCount: number;
    // 是否是免费信息
    isFree: boolean;
    onChangePrice?: (price: { min: number; max: number }) => void;
  }) => {
    const { estimatedTime, selectedPrice, gpuCount, isFree, onChangePrice } = props;
    const GPURule = useGPURule();
    const accountDetail = useGlobalPresenter((s) => s.accountDetail);
    const { min, max } = useEstimatedTimeHours(estimatedTime);

    const currPrice = isFree ? GPURule?.unitPrice || 0 : selectedPrice?.realUnitPrice;
    const estimatedPriceMin = formatAmount((currPrice || 0) * min * gpuCount, 4);
    const estimatedPriceMax = formatAmount((currPrice || 0) * max * gpuCount, 4);

    useEffect(() => {
      onChangePrice?.({ min: Number(estimatedPriceMin), max: Number(estimatedPriceMax) });
    }, [estimatedPriceMin, estimatedPriceMax, onChangePrice]);

    // 计算消费分配逻辑
    const calculateConsumption = () => {
      const couponBalance = accountDetail?.couponBalanceTotalAmount || 0;
      const minCost = min * (selectedPrice?.realUnitPrice || 0) * gpuCount;
      const maxCost = max * (selectedPrice?.realUnitPrice || 0) * gpuCount;

      // 如果代金券额度够最大费用，只消耗代金券
      if (couponBalance >= maxCost) {
        return {
          couponMin: formatAmount(minCost, 4),
          couponMax: formatAmount(maxCost, 4),
          balanceMin: formatAmount(0),
          balanceMax: formatAmount(0),
        };
      }

      // 如果代金券额度够最小费用但不够最大费用
      if (couponBalance >= minCost) {
        return {
          couponMin: formatAmount(minCost, 4),
          couponMax: formatAmount(couponBalance, 4),
          balanceMin: formatAmount(0),
          balanceMax: formatAmount(maxCost - couponBalance, 4),
        };
      }

      // 代金券不够最小费用，全部消耗代金券，剩余用余额
      return {
        couponMin: formatAmount(couponBalance, 4),
        couponMax: formatAmount(couponBalance, 4),
        balanceMin: formatAmount(minCost - couponBalance, 4),
        balanceMax: formatAmount(maxCost - couponBalance, 4),
      };
    };

    const consumption = calculateConsumption();

    const renderPriceJsx = () => {
      if (!estimatedTime) return <>--</>;
      return (
        <>
          <Dropdown
            trigger={['hover']}
            placement="top"
            popupRender={() => {
              return (
                <ActionBarDropdownContent title="消费明细" style={{ minWidth: 180 }}>
                  {isFree ? (
                    <>
                      <ActionBarDropdownContent.Item label="预估消费：">
                        ¥{estimatedPriceMin} - ¥{estimatedPriceMax}
                      </ActionBarDropdownContent.Item>
                      <ActionBarDropdownContent.Item label="活动折扣：">
                        Lora限时0折
                      </ActionBarDropdownContent.Item>
                      <Divider dashed size="small" />
                      {/* <ActionBarDropdownContent.Item label="预估费用：">
                        ¥{0}
                      </ActionBarDropdownContent.Item> */}
                    </>
                  ) : (
                    <>
                      <ActionBarDropdownContent.Item label="预估费用：">
                        ¥{estimatedPriceMin} - ¥{estimatedPriceMax}
                      </ActionBarDropdownContent.Item>
                      <Divider dashed size="small" />
                    </>
                  )}

                  <ActionBarDropdownContent.Item label="账户余额消费：">
                    {consumption.balanceMin === consumption.balanceMax ? (
                      <span>¥{consumption.balanceMin}</span>
                    ) : (
                      <>
                        <span>
                          ¥{consumption.balanceMin}~¥{consumption.balanceMax}
                        </span>
                      </>
                    )}
                  </ActionBarDropdownContent.Item>
                  <ActionBarDropdownContent.Item label="代金券消费：">
                    {consumption.couponMin === consumption.couponMax ? (
                      <span>¥{consumption.couponMin}</span>
                    ) : (
                      <>
                        <span>
                          ¥{consumption.couponMin}~¥{consumption.couponMax}
                        </span>
                      </>
                    )}
                  </ActionBarDropdownContent.Item>
                </ActionBarDropdownContent>
              );
            }}
          >
            <span className={cx('info-detail')} style={{ marginRight: 6, cursor: 'pointer' }}>
              消费明细 <UpOutlined />
            </span>
          </Dropdown>
          {isFree ? (
            <span>
              <span className={cx('info-line')}>
                ¥{estimatedPriceMin} ~ ¥{estimatedPriceMax}
              </span>
              <LPrice
                unit={false}
                size={26}
                symbolStyle={{ fontSize: 14, marginRight: 0 }}
                value={0}
              />
            </span>
          ) : (
            <>
              <LPrice
                unit={false}
                size={26}
                symbolStyle={{ fontSize: 14, marginRight: 0 }}
                value={estimatedPriceMin}
              />
              ~
              <LPrice
                unit={false}
                size={26}
                symbolStyle={{ fontSize: 14, marginRight: 0 }}
                value={estimatedPriceMax}
              />
            </>
          )}
        </>
      );
    };

    return (
      <div className={cx('info-item')} style={{ marginLeft: 40 }}>
        <div>
          <div className={cx('info-item')} style={{ textAlign: 'right', marginRight: 0 }}>
            预估费用
          </div>
          <div className={cx('info-value')}>{renderPriceJsx()}</div>
        </div>
      </div>
    );
  }
);

export interface IFinetuneSunmmaryProps<T extends Record<string, any> = Record<string, any>> {
  form?: FormInstance<T>;
  estimatedTime?: IModelEstimatedTimeResult;
  selectedPrice?: ITaskPriceItem;
  tuneItem?: ITuneItem;
  gpuCount?: number;
  onClickStart?: () => any;
  onChangePrice?: (price: { min: number; max: number }) => void;
  submitText?: string;
}

export const FinetunePriceSummary = React.memo<IFinetuneSunmmaryProps>((props) => {
  const {
    form,
    estimatedTime,
    gpuCount,
    selectedPrice,
    onClickStart,
    tuneItem,
    onChangePrice,
    submitText,
  } = props;

  const [submitLoading, setSubmitLoading] = useState(false);
  const handleSubmit = useMemoizedFn(async () => {
    setSubmitLoading(true);

    try {
      await onClickStart?.();
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitLoading(false);
    }
  });

  // 是否是免费
  const isFree = isBuiltLora(tuneItem!);

  return (
    <div className={cx('finetune-price-summary')}>
      <div className={cx('content')}>
        <div className={cx('left-content')}>
          <div className={cx('check-info-form')}>
            <GPUCountText value={gpuCount} />
            <EstimatedTimeText estimatedTime={estimatedTime} />
          </div>
        </div>
        <div className={cx('right-content')}>
          <FreeTip
            text="LoRA模型评估限时免费"
            style={{ marginRight: '24px' }}
            tuneItem={tuneItem!}
          />

          <div className={cx('check-info-form')}>
            {/* <EstimatedTimeText estimatedTime={estimatedTime} /> */}
            <EstimatedPriceText
              isFree={isFree}
              gpuCount={gpuCount!}
              estimatedTime={estimatedTime}
              selectedPrice={selectedPrice}
              onChangePrice={onChangePrice}
            />
          </div>
        </div>
      </div>
      <Button
        loading={submitLoading}
        className={cx('start-training')}
        type="primary"
        onClick={handleSubmit}
      >
        {submitText || '开始训练'}
      </Button>
    </div>
  );
});
