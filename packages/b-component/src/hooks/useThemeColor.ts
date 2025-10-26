import { EThemeMode } from '@llama-fa/types';
import { useMemo } from 'react';
import { useTheme } from './useTheme';

export const useThemeColor = () => {
  const theme = useTheme();

  return useMemo(() => {
    const themeColor = 'primary';

    return themeColor;
  }, [theme]);
};
