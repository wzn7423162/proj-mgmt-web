import { useEffect, useState } from 'react';

export const useMediaQuery = (): 2 | 3 | 4 | 6 => {
  const getSize = (): 2 | 3 | 4 | 6 => {
    // Prevents SSR issues
    if (typeof window !== 'undefined') {
      const isSmall = window.matchMedia('(max-width: 1280px)').matches;
      const isMedium = window.matchMedia('(max-width: 1889px)').matches;
      const isLarge = window.matchMedia('(max-width: 2599px)').matches;

      if (isSmall) {
        return 2;
      } else if (isMedium) {
        return 3;
      } else if (isLarge) {
        return 4;
      } else {
        return 6;
      }
    }
    return 2;
  };

  const [screenSize, setScreenSize] = useState<2 | 3 | 4 | 6>(getSize());

  function handleChange() {
    setScreenSize(getSize());
  }

  useEffect(() => {
    handleChange();

    window.addEventListener('resize', handleChange);

    return () => {
      window.removeEventListener('resize', handleChange);
    };
  }, []);

  return screenSize;
};
