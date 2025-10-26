import { IGoodsEntity, IPayOrderEntity } from "@llama-fa/constants";
import { reqClient } from "@llama-fa/utils";




/**
 * 获取商品
 * @returns 
 */
export const getGoods = () => {
  return reqClient.get<IGoodsEntity[]>('/front/goods/all');
};

export interface ICreatePayOrderParams {
  goodsId: string;
  otherAmount?: number;
}

/**
 * 创建支付订单
 * @param params 
 * @returns 
 */
export const createPayOrder = (params: ICreatePayOrderParams) => {
  return reqClient.post<IPayOrderEntity>('/front/pay-order/to-pay', params);
}

export const getPayOrder = (id: string) => {
  return reqClient.get<IPayOrderEntity>(`/front/pay-order/detail?id=${id}`);
}

/**
 * 关闭订单
 * @param id 
 * @returns 
 */
export const closePayOrder = (id: string) => {
  return reqClient.put(`/front/pay-order/close`, {
    id
  });
}

/**
 * 获取余额提醒的值
 */
export const getBalanceTip = () => {
  return reqClient.get<string>('/front/user/getMin')
}

export interface IBalanceMin {
  balanceAmountMin?: string;
  // （0不开启 1开启）
  isEnable: number,
}
export const updateBalanceMin = (params: IBalanceMin) => {
  return reqClient.put<IBalanceMin>('/front/user/editMin', params)
}