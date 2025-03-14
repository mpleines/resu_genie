'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export const useScrollToTop = () => {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
};
