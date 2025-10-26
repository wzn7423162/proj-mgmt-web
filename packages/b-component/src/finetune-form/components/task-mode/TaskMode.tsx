import { AUTO_CONTINUE_NAME_KEY, MAX_CONTINUE_TIMES_NAME_KEY } from '@llama-fa/constants';
import { Col, Form, FormInstance } from 'antd';
import { ETaskMode, ITaskPriceItem } from '@llama-fa/types';
import ProForm, {
  ProFormDependency,
  ProFormDigit,
  ProFormProps,
  ProFormSwitch,
} from '@ant-design/pro-form';

import React from 'react';
import { ReduceNumberInput } from '@/form-item/reduce-number-input/ReduceNumberInput';
import Style from './TaskMode.module.scss';
import { TaskPriceCard } from '../task-price-card/TaskPriceCard';
import { cxb } from '@llama-fa/utils';
import { useFormCommonProps } from '@/finetune-form/hooks/useFormCommonProps';
import { useMemoizedFn } from 'ahooks';

const cx = cxb.bind(Style);

export interface ITaskModeProps {
  form?: FormInstance<any>;
  onValuesChange?: ProFormProps['onValuesChange'];
  priceInfos?: ITaskPriceItem[];
  selectedPrice?: ITaskPriceItem;
  selectedModelInfo?: any;
  onSelect?: (value: ITaskPriceItem) => any;
  children?: React.ReactNode;
  hiddenDetail?: boolean;
}

export const TaskMode = React.memo<ITaskModeProps>((props) => {
  const {
    priceInfos = [],
    form,
    onValuesChange,
    selectedPrice,
    selectedModelInfo,
    onSelect,
    children,
    hiddenDetail,
  } = props;

  const { formProps } = useFormCommonProps();

  const isDynamicMode = selectedPrice?.appMode === ETaskMode.dynamic;

  return (
    <div className={cx('task-mode')}>
      <div className={cx('mode-info-container')}>
        <div className={cx('mode-infos')}>
          {priceInfos.map((item) => (
            <TaskPriceCard
              key={item.appMode}
              showDynamicPriceDetail={item.appMode === ETaskMode.queue}
              hiddenDetail={hiddenDetail}
              disabled={item.available === 0}
              mode={item.appMode as any}
              discount={item.discount}
              minDuration={selectedModelInfo ? item.minWaitTime * 1000 : undefined}
              maxDuration={selectedModelInfo ? item.maxWaitTime * 1000 : undefined}
              price={item.realUnitPrice}
              selected={selectedPrice?.appMode === item.appMode}
              onClick={() => onSelect?.(item)}
            />
          ))}
        </div>
        <div className={cx('children-container')}>{children}</div>
      </div>
      {isDynamicMode ? (
        <>
          <ProForm<{}>
            layout="horizontal"
            className={cx('form-container')}
            {...formProps}
            form={form}
            autoFocusFirstInput={false}
            onValuesChange={onValuesChange}
          >
            <ProFormSwitch name={AUTO_CONTINUE_NAME_KEY} label="自动继续运行" />
            <ProFormDependency name={[AUTO_CONTINUE_NAME_KEY]}>
              {(data) => {
                if (data[AUTO_CONTINUE_NAME_KEY]) {
                  return (
                    <Col {...formProps.colProps}>
                      <Form.Item
                        name={MAX_CONTINUE_TIMES_NAME_KEY}
                        label="继续运行最大次数"
                        className={cx('max-run-times')}
                      >
                        <ReduceNumberInput min={1} />
                      </Form.Item>
                    </Col>
                  );
                }
                return null;
              }}
            </ProFormDependency>
          </ProForm>
          <div className={cx('remind-text')}>
            开启自动继续运行后，灵动超省任务在资源不足中断任务后，检测到有可用资源时自动继续运行任务，任务中断与继续运行时不会给您发送短信通知
          </div>
        </>
      ) : null}
    </div>
  );
});
