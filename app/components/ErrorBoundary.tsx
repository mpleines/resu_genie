'use client';
import { Button } from '@/components/ui/button';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Error from 'next/error';

type Props = {
  error: Error & { digest?: string | undefined };
  reset?: () => void;
};

export default function ErrorBoundary({ reset }: Props) {
  const t = useTranslations('errorBoundary');

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="flex flex-col items-center space-y-2">
        <AlertCircle className="w-8 h-8 text-red-600" />
        <h1 className="text-xl">{t('title')}</h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>
      <div className="flex space-x-2">
        <Button
          variant="secondary"
          onClick={() => (window.location.href = '/')}
        >
          <Home />
          <div>{t('goToDashboard')}</div>
        </Button>
        {reset != null && (
          <Button onClick={reset}>
            <RefreshCw />
            <div>Try again</div>
          </Button>
        )}
      </div>
    </div>
  );
}
