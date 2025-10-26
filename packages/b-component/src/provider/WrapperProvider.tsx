import React, { FC, memo } from 'react';

import { AntdProvider } from './AntdProvider';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@llama-fa/utils/request';
import { EThemeMode} from '@llama-fa/types';

export interface IWrapperProviderProps {
  children?: React.ReactNode;
  themeMode?: EThemeMode;
}

/**
 * 包装后的通用Provider
 */
export const WrapperProvider: FC<IWrapperProviderProps> = memo((props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AntdProvider themeMode={props.themeMode}>{props.children}</AntdProvider>
    </QueryClientProvider>
  );
});
