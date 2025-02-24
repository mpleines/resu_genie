import { AlertCircle } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import React from 'react';

type AlertDestructiveProps = {
  message: string;
  className?: React.HTMLAttributes<HTMLDivElement>['className'];
  ref?: React.Ref<HTMLDivElement>;
};

const AlertDestructive: React.FC<AlertDestructiveProps> = ({
  message,
  className,
  ref,
}) => {
  return (
    <Alert ref={ref} variant="destructive" className={className}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export { AlertDestructive };
