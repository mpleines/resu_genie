'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { FunctionComponent, ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

interface SubmitButtonProps {
  text?: string;
  icon?: ReactNode;
}

const SubmitButton: FunctionComponent<SubmitButtonProps> = ({
  text = 'Submit',
  icon,
}) => {
  const formStatus = useFormStatus();

  return (
    <Button type="submit">
      {formStatus.pending ? (
        <>
          <Loader2 className="animate-spin" /> <span>{text}</span>
        </>
      ) : (
        <>
          {icon && icon}
          {text}
        </>
      )}
    </Button>
  );
};

export default SubmitButton;
