import { useGlobalPresenter } from '../context';
import { useMemo } from 'react';

export const useTotalAmount = () => {
  const accountDetail = useGlobalPresenter((ctx) => ctx.accountDetail);

  const totalAmount = useMemo(() => {
    return (accountDetail?.balanceAmount ?? 0) + (accountDetail?.couponBalanceTotalAmount ?? 0);
  }, [accountDetail]);

  return totalAmount;
};
