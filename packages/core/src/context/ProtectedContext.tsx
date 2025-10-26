import { createPresenter, queryClient } from '@llama-fa/utils';

import { useRef } from 'react';
import { useState } from 'react';

export interface IProtectedProviderProps {}

const ContextHandle = (props: IProtectedProviderProps) => {
  const [isNavCollapse, setIsNavCollapse] = useState(false);

  const layoutTitleRef = useRef<HTMLDivElement>(null);

  return {
    isNavCollapse,
    setIsNavCollapse,
    layoutTitleRef,
  };
};

export const [useProtectedPresenter, ProtectedProvider] = createPresenter<
  ReturnType<typeof ContextHandle>,
  IProtectedProviderProps
>(ContextHandle);
