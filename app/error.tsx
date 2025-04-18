'use client';

import { useEffect } from 'react';
import ErrorBoundary from './components/ErrorBoundary';

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
