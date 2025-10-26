import { createPresenter, queryClient } from '@llama-fa/utils';
import { getAccountDetail, getUserInfo } from '../api/user';

import { USER_QUERY_KEY } from '@llama-fa/constants';
import { encrypt } from '../utils';
import { getUserAvatar } from '@/utils/user';
import { useMemoizedFn } from 'ahooks';
import { useQuery } from '@tanstack/react-query';
import { youmengUploader } from '../utils/youmengUpload';
import { dictTypeListAPI } from '../api/publicData';
import { IDictItemEntity } from '@llama-fa/types';

export interface IGlobalContextProps {}

function globalContext(props: IGlobalContextProps) {
  const userQueryResult = useQuery({
    queryKey: [USER_QUERY_KEY],
    queryFn: async () => {
      try {
        const res = await getUserInfo();
        youmengUploader.upload(res);
        res.avatarIndex = getUserAvatar(res);
        return res;
      } catch (error) {
        console.log(error);

        return null;
      }
    },
  });

  const balanceQueryResult = useQuery({
    queryKey: [USER_QUERY_KEY, 'balanceAmount'],
    queryFn: getAccountDetail,
    // 每分钟刷新一次余额，启动后的显示余额依赖此功能
    refetchInterval: 1000 * 60,
    staleTime: 12 * 1000, // 2秒内数据被认为是新鲜的，不
    gcTime: 12 * 1000,
    initialData: {
      balanceAmount: 0,
      couponBalanceAmount7Day: 0,
      couponBalanceTotalAmount: 0,
      payCouponBalanceAmount7Day: 0,
      activityCouponBalanceAmount7Day: 0,
      totalRecharge: 0,
      totalCouponAmount: 0,
      totalOrder: 0,
    },
    enabled: !!userQueryResult.data,
  });

  // 全局字典：模型标签（文本、图片分别存储）
  const modelTextLabelDictQueryResult = useQuery({
    queryKey: [USER_QUERY_KEY, 'modelTextLabelDict'],
    queryFn: () => dictTypeListAPI('model_text_label'),
    initialData: [] as IDictItemEntity[],
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 10,
    refetchOnMount: 'always', // 刷新或首次挂载时强制请求
  });

  const modelImageLabelDictQueryResult = useQuery({
    queryKey: [USER_QUERY_KEY, 'modelImageLabelDict'],
    queryFn: () => dictTypeListAPI('model_image_label'),
    initialData: [] as IDictItemEntity[],
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 10,
    refetchOnMount: 'always',
  });

  const { data: user, refetch: flushUserInfo } = userQueryResult;
  const { data: accountDetail, refetch: flushAccountDetail } = balanceQueryResult;
  // 旧的 modelLabelDictQueryResult 已移除，改为双字典
  const { data: modelTextLabelDict, refetch: flushModelTextLabelDict } = modelTextLabelDictQueryResult;
  const { data: modelImageLabelDict, refetch: flushModelImageLabelDict } = modelImageLabelDictQueryResult;

  const flushUserAllData = useMemoizedFn(() => {
    flushUserInfo();
    flushAccountDetail();
  });

  const invalidateAllUserData = useMemoizedFn(() => {
    queryClient.invalidateQueries({
      queryKey: [USER_QUERY_KEY],
    });
  });

  return {
    user,
    isAgentUser: user?.currentIdentityType === '2',
    accountDetail,
    flushUserInfo,
    flushAccountDetail,
    flushUserAllData,
    userQueryResult,
    invalidateAllUserData,
    isLogin: !!user,
    // 全局可用的字典数据（文本/图片）
    modelTextLabelDict,
    modelImageLabelDict,
    flushModelTextLabelDict,
    flushModelImageLabelDict,
  };
};

export const [useGlobalPresenter, GlobalProvider] = createPresenter<
  ReturnType<typeof globalContext>,
  IGlobalContextProps
>(globalContext);
