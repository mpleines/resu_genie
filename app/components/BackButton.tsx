'use client';

import { Button } from '@/components/ui/button';
import { FunctionComponent } from 'react';
import { useStepper } from '../(steps)/useStepper';
import { ChevronLeft } from 'lucide-react';

const BackButton: FunctionComponent = () => {
  const stepper = useStepper();

  return (
    <Button
      type="button"
      variant="outline"
      className="mr-2 w-24"
      onClick={stepper.previous}
    >
      <ChevronLeft />
      Prev
    </Button>
  );
};

export default BackButton;
