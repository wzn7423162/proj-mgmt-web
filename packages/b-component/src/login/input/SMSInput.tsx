import { AuthUtils, cxb } from '@llama-fa/utils';
import { Form, Input, InputProps } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useMemoizedFn, useUpdate } from 'ahooks';

import { GET_SMS_INTERVEAL } from '@llama-fa/constants';
import { IBaseLoginFormInput } from './types';
import Style from './SMSInput.module.scss';
import { useLoginFormPresenter } from '../context/LoginFormContext';

const cx = cxb.bind(Style);

export interface ISMSInputProps extends IBaseLoginFormInput {
  onGetSMS?: () => Promise<any>;
}

export const SMSInput = React.memo((props: ISMSInputProps) => {
  const { formItemProps, onGetSMS, ...restProps } = props;

  const form = useLoginFormPresenter((ctx) => ctx.form);
  const SMSGetTime = useLoginFormPresenter((ctx) => ctx.SMSGetTime);
  const setSMSGetTime = useLoginFormPresenter((ctx) => ctx.setSMSGetTime);
  const [smsApiExecuteing, setSmsApiExecuteing] = useState(false);

  const flushUI = useUpdate();

  const phoneNumber = form.getFieldValue('phone');

  const SMSTextClickable = useMemo(() => {
    return AuthUtils.isRegularPhone(phoneNumber);
  }, [phoneNumber]);

  const handleSMSClick = useMemoizedFn<React.MouseEventHandler<HTMLDivElement>>((event) => {
    event.stopPropagation();

    if (SMSGetTime) return;
    if (smsApiExecuteing) return;

    // 当手机号为空时，提示并阻止后续请求
    const rawPhone = form.getFieldValue('phone');
    const phone = rawPhone?.trim();
    if (!phone) {
        form.validateFields(['phone']).catch(() => {});
        return;
    }

    setSmsApiExecuteing(true);

    props.onGetSMS?.()
        .then(() => {
            setSMSGetTime(+Date.now());
        })
        .catch(console.error)
        .finally(() => {
            setSmsApiExecuteing(false);
        });
  });

  useEffect(() => {
    if (!SMSGetTime) return;

    let taskId: any = undefined;

    const intervelFlush = () => {
      if (+Date.now() - SMSGetTime > GET_SMS_INTERVEAL) {
        setSMSGetTime?.(undefined);
        return;
      }

      taskId = setTimeout(() => {
        flushUI();
        intervelFlush();
      }, 1e3);
    };

    intervelFlush();

    return () => {
      clearTimeout(taskId);
    };
  }, [SMSGetTime]);

  return (
    <>
      <Form.Item
        name="smsCode"
        validateTrigger="onBlur"
        {...formItemProps}
        rules={[
          {
            validator: (rule, value) => {
              if (!SMSGetTime) return Promise.resolve();
              if (!value) {
                return Promise.reject('请输入验证码');
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <Input
          className={cx('sms-input', 'form-input')}
          type="text"
          placeholder="请输入验证码"
          {...restProps}
          maxLength={6}
          suffix={
            SMSGetTime ? (
              <div className={cx('left-time')}>
                {Math.ceil((GET_SMS_INTERVEAL - (+Date.now() - SMSGetTime)) / 1e3) + 's'}
              </div>
            ) : (
              <div
                className={cx('get-sms', { 'clickable-text': SMSTextClickable })}
                // 统一使用点击处理器：无论手机号是否有效都能触发提示逻辑
                onClickCapture={handleSMSClick}
              >
                获取验证码
              </div>
            )
          }
        />
      </Form.Item>
      {/* 监听手机号变化以刷新UI */}
      <Form.Item
        name="phone"
        style={{ display: 'none' }}
        rules={[
          {
            validator: (rule, value) => {
              flushUI();
              return Promise.resolve();
            },
          },
        ]}
      />
    </>
  );
});
