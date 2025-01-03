'use client';
import { PropsWithChildren, useEffect, useState } from 'react';

const HeaderLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const [shouldShowBorder, setShouldShowBorder] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      const { pageYOffset } = window;
      if (pageYOffset > 0) {
        setShouldShowBorder(true);
      } else {
        setShouldShowBorder(false);
      }
    });
  }, []);

  return (
    <header
      className={`sticky top-0 w-full bg-transparent z-10 h-[64px] ${
        shouldShowBorder ? 'border-b bg-white/10 backdrop-blur-md' : ''
      }`}
    >
      {children}
    </header>
  );
};

export default HeaderLayout;
