import { useCreation, useDebounceEffect } from 'ahooks';
import { useMemo, useState } from 'react';

import { EThemeMode } from '@llama-fa/types';

/**
 * 获取当前的主图
 * @returns
 */
export const useTheme = () => {
  const [resultTheme, setResultTheme] = useState<EThemeMode>(EThemeMode.Light);

  return resultTheme;
};
