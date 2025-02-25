'use client';

import { Button } from '@/components/ui/button';
import { ChevronRight, Loader2 } from 'lucide-react';
import { FunctionComponent, ReactNode } from 'react';

interface SubmitButtonProps {
  text?: string;
  iconLeft?: ReactNode;
  showChevronRight?: boolean;
  pending?: boolean;
  disabled?: boolean;
}

const SubmitButton: FunctionComponent<SubmitButtonProps> = ({
  text = 'Submit',
  iconLeft,
  showChevronRight = true,
  pending,
  disabled,
}) => {
  return (
    <Button type="submit" className="w-24" disabled={disabled}>
      {pending ? (
        <>
          <Loader2 className="animate-spin" /> <span>{text}</span>
        </>
      ) : (
        <>
          {iconLeft && iconLeft}
          {text}
        </>
      )}
      {showChevronRight && <ChevronRight />}
    </Button>
  );
};

export default SubmitButton;
