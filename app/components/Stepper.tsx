'use client';
import React, { FunctionComponent } from 'react';
import { useStepper } from '../(dashboard)/useStepper';
import { Button } from '@/components/ui/button';
import { Circle, Dot } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface StepperProps {}

const Stepper: FunctionComponent<StepperProps> = () => {
  const { steps, comesAfterCurrentStep, navigateTo } = useStepper();
  const currentPath = usePathname();

  return (
    <div className="py-2 flex flex-wrap gap-4 justify-center items-center">
      {steps.map((step) => {
        const index = steps.findIndex((s) => s.path === step.path);
        const isDisabled = comesAfterCurrentStep(step);

        return (
          <React.Fragment>
            <Button
              variant="link"
              disabled={isDisabled}
              onClick={() => navigateTo(step)}
            >
              <Circle />
              {step.label}
            </Button>
            {index < steps.length - 1 && (
              <Dot
                className={
                  currentPath !== step.path &&
                  steps.findIndex((s) => s.path === currentPath) < index
                    ? 'opacity-50'
                    : ''
                }
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Stepper;
