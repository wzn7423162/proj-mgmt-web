import { EPayStatus, IPayOrderEntity, USER_QUERY_KEY } from '@llama-fa/constants';
import { createPresenter } from '@llama-fa/utils';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useMemoizedFn, useRequest } from 'ahooks';
import { getPayOrder } from '@llama-fa/core/api';
import { message } from 'antd';


export interface IPayOderOptions {
  successCallback?: Function,
  errorCallback?: Function
}
const payContext = () => {

  const [open, setOpen] = useState(false);
  const [orderStatus, setOrderStatue] = useState<EPayStatus>(EPayStatus.WAITING);
  const [payOrder, setPayOrder] = useState<IPayOrderEntity | null>(null)

  const callbackFunction = useRef<IPayOderOptions>({
    successCallback: () => { },
    errorCallback: () => { }
  });

  // 轮询查询支付是否成功
  const { data, loading, run: loopPayOrder, cancel: cancelLoopPayOrder } = useRequest(getPayOrder, {
    pollingInterval: 3000, // 3s轮询一次
    pollingWhenHidden: false,
    pollingErrorRetryCount: 3,
    manual: true,
    onError: (error) => {
      message.error(error.message);
    },
  });

  useEffect(() => {
    // 关闭的时候取消轮询
    if (!open) {
      cancelLoopPayOrder()
    }
  }, [open])


  useEffect(() => {
    if (data?.status) {
      setOrderStatue(data?.status!);

    }
    if (data?.status !== EPayStatus.WAITING) {
      cancelLoopPayOrder()
      callbackFunction.current?.errorCallback?.();
    }
    if (data?.status === EPayStatus.SUCCESS) {
      callbackFunction.current?.successCallback?.();
    }

  }, [data])



  const openPay = useMemoizedFn((payOrder: IPayOrderEntity, options?: IPayOderOptions) => {
    if (options) {
      callbackFunction.current = options;
    }
    setPayOrder(payOrder);
    setOpen(true);
    if (payOrder.id) {
      // 开始轮询订单
      loopPayOrder(payOrder.id);
    }
  })

  /**
   * 立即获取订单状态
   */
  const immediatelyGetPayOrder = useMemoizedFn(() => {
    loopPayOrder(payOrder?.id!);
  })

  return {
    open,
    setOpen,
    openPay,
    orderStatus,
    payOrder,
    immediatelyGetPayOrder,
    paySuccessCallback: () => {
      if (callbackFunction.current) {
        callbackFunction.current.successCallback?.();
      }
    }
  }

}

export const [usePayPresenter, PayProvider] = createPresenter<
  ReturnType<typeof payContext>,
  any
>(payContext);
