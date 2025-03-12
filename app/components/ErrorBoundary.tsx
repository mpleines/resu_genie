import { Button } from '@/components/ui/button';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import Error from 'next/error';

type Props = {
  error: Error & { digest?: string | undefined };
  reset?: () => void;
};

export default function ErrorBoundary({ error, reset }: Props) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="flex flex-col items-center space-y-2">
        <AlertCircle className="w-8 h-8 text-red-600" />
        <h1 className="text-xl">Something went wrong!</h1>
        <p className="text-muted-foreground">
          We've encountered a critical error. Our team has been notified.
        </p>
      </div>
      <div className="flex space-x-2">
        <Button
          variant="secondary"
          onClick={() => (window.location.href = '/')}
        >
          <Home />
          <div>Go to Dashboard</div>
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
