'use client';
import { useEffect, useRef } from 'react';

const useScrollToElement = () => {
  const ref = useRef<any | null>(null);

  const scrollToElement = () => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToElement();
  }, [ref.current]);

  return { ref, scrollToElement };
};

export default useScrollToElement;
