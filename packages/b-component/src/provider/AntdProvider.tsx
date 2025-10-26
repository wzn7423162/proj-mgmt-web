import { App, ConfigProvider, theme } from 'antd';
import React, { FC } from 'react';
import { useAntdToken, useTheme } from '../hooks';

import { EThemeMode, DefaultTheme, DarkTheme } from '@llama-fa/types';
import zhCN from 'antd/locale/zh_CN';

export interface IAntdProviderProps {
  children: React.ReactNode;

  themeMode?: EThemeMode;
}

export const AntdProvider: FC<IAntdProviderProps> = React.memo(({ 
  themeMode, children
}) => {
  const token = useAntdToken();

  const currTheme = useTheme();
  if (!currTheme) {
    return <></>;
  }
  
  const theme = (themeMode || currTheme) === EThemeMode.Dark ? DarkTheme : DefaultTheme;

  return (
    <ConfigProvider
      locale={zhCN}
      theme={theme}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
});
