import type React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';

interface AlertSuccessProps {
  message: string;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

const AlertSuccess: React.FC<AlertSuccessProps> = ({
  message,
  className,
  ref,
}) => {
  return (
    <Alert
      ref={ref}
      className={`border-green-500 bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300 ${
        className || ''
      }`}
    >
      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default AlertSuccess;
