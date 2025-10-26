import { useEffect, useState } from 'react';
import { isMobile as uaIsMobile } from '@llama-fa/utils';

export const useIsMobile = (): boolean => {
  const getIsMobile = () => {
    if (typeof window === 'undefined') return uaIsMobile();
    const isNarrow = window.matchMedia('(max-width: 768px)').matches;
    return isNarrow || uaIsMobile();
  };

  const [mobile, setMobile] = useState<boolean>(getIsMobile());

  useEffect(() => {
    const onChange = () => setMobile(getIsMobile());
    const mql = window.matchMedia('(max-width: 768px)');

    window.addEventListener('resize', onChange);
    window.addEventListener('orientationchange', onChange);
    mql.addEventListener('change', onChange);

    return () => {
      window.removeEventListener('resize', onChange);
      window.removeEventListener('orientationchange', onChange);
      mql.removeEventListener('change', onChange);
    };
  }, []);

  return mobile;
};
