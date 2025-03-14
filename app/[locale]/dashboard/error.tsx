'use client';

import ErrorBoundary from '@/app/components/ErrorBoundary';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorBoundary error={error} reset={reset} />;
}
