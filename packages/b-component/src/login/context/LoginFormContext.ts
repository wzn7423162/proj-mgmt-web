import { EChangePasswordType, ESMSType, IBaseLoginFormData, ISMSGetInfo } from '../types';
import { Form, message } from 'antd';
import { createPresenter, cxb, reqClient, useLoadingHandler } from '@llama-fa/utils';
// import { editPassWord, forgotPassword, forgotSmsCode, loginSmsCode } from '@llama-fa/core/api';

import { editPassWord, forgotPassword, forgotSmsCode, loginSmsCode } from '@llama-fa/core/api/user';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import type { ArgsProps } from 'antd/es/message/interface';
import Style from './LoginFormContext.module.scss';
import { useMemoizedFn } from 'ahooks';

const cx = cxb.bind(Style);

export interface ILoginFormContextProps {
  msgInContainer?: boolean;
}

export const smsCodeMethods = {
  [ESMSType.login]: loginSmsCode,
  [ESMSType.forgotPassword]: forgotSmsCode,
};

export const changePasswordMethods = {
  [EChangePasswordType.forgotPassword]: forgotPassword,
  [EChangePasswordType.editPassword]: editPassWord,
};

const LoginFormContext = (props: ILoginFormContextProps) => {
  const { msgInContainer } = props;

  const [SMSGetTime, setSMSGetTime] = useState<number | undefined>(undefined);
  const [SMSInfo, setSMSInfo] = useState<ISMSGetInfo | undefined>(undefined);

  const [form] = Form.useForm<IBaseLoginFormData>();
  const containerRef = useRef<HTMLDivElement>(null);

  const loginMsg = useMemoizedFn((option: ArgsProps) => {
    message.open({
      className: msgInContainer ? cx('login-message') : undefined,
      ...option,
    });
  });

  const errorHandle = useMemoizedFn((error: any) => {
    console.error(error);

    if (typeof error === 'string') {
      loginMsg({ type: 'error', content: error });
    }
  });

  const handleGetSMS = useMemoizedFn(async (type: ESMSType = ESMSType.login) => {
    const phone = form.getFieldValue('phone');
    // 新增：手机号为空时提示并阻止后续请求
    if (!phone || String(phone).trim() === '') {
      try {
        await form.validateFields(['phone']);
      } catch (_) {}
      loginMsg({ type: 'error', content: '请输入手机号' });
      return;
    }
    const getSMSCode = smsCodeMethods?.[type] ?? loginSmsCode;

    try {
      const result = await getSMSCode({ phone });

      const uuid = result?.uuid;

      if (!uuid) {
        throw `uuid为空，获取短信验证码失败`;
      }

      setSMSInfo({ uuid });

      loginMsg({ type: 'success', content: '获取短信验证码成功' });
    } catch (error: any) {
      errorHandle(error);
      throw error;
    }
  });

  const { loading: forgotHandleLoading, wrapedHandler: handleForgotPassword } = useLoadingHandler(
    async (type: EChangePasswordType = EChangePasswordType.forgotPassword) => {
      const changePasswordAPI = changePasswordMethods[type] ?? forgotPassword;
      const { phone, smsCode, password } = form.getFieldsValue();

      try {
        const uuid = SMSInfo?.uuid;

        if (!uuid) {
          throw '请先获取短信验证码';
        }

        await changePasswordAPI({
          phone,
          smsCode,
          password,
          uuid,
        });

        message.success('重置密码成功');

        return true;
      } catch (error) {
        errorHandle(error);
      }
    }
  );

  useEffect(() => {
    form.setFieldsValue({
      phone: '',
      password: '',
      smsCode: '',
    });
  }, [form]);

  // 需求要求从form表单区域弹出message，在卸载组件时恢复为document.body
  useLayoutEffect(() => {
    if (!msgInContainer) return;

    let unmount = false;

    setTimeout(() => {
      if (unmount) return;

      message.config({
        getContainer: () => containerRef.current || document.body,
      });
    }, 2e2);

    return () => {
      unmount = true;
      message.config({
        getContainer: () => document.body,
      });
    };
  }, [msgInContainer]);

  return {
    containerRef,
    form,
    SMSGetTime,
    setSMSGetTime,
    loginMsg,
    SMSInfo,
    setSMSInfo,
    handleGetSMS,
    forgotHandleLoading,
    handleForgotPassword,
    errorHandle,
  };
};

export const [useLoginFormPresenter, LoginFormProvider] = createPresenter<
  ReturnType<typeof LoginFormContext>,
  ILoginFormContextProps
>(LoginFormContext);
