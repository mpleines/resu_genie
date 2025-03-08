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
  formRef?: React.RefObject<HTMLFormElement | null>;
}

const SubmitButton: FunctionComponent<SubmitButtonProps> = ({
  text = 'Submit',
  iconLeft,
  showChevronRight = true,
  pending,
  disabled,
  formRef,
}) => {
  if (formRef?.current != null) {
    return (
      <Button
        type="button"
        onClick={() => formRef?.current?.requestSubmit()}
        className="w-24"
        disabled={pending || disabled}
      >
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
  }
  return (
    <Button type="submit" className="w-24" disabled={pending || disabled}>
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
