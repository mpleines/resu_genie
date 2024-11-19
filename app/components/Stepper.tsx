'use client';
import React, { FunctionComponent } from 'react';
import { useStepper } from '../(dashboard)/useStepper';
import { usePathname } from 'next/navigation';
import { Check, Circle, Dot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepperProps {}

const Stepper: FunctionComponent<StepperProps> = () => {
  const { steps, comesAfterCurrentStep, navigateTo } = useStepper();
  const currentPath = usePathname();

  return (
    <div className="py-2 flex flex-col flex-wrap gap-4 justify-center items-center">
      {steps.map((step) => {
        const isDisabled = comesAfterCurrentStep(step);
        const isActive = currentPath === step.path;
        const isCurrent = currentPath === step.path;

        return (
          <div
            className="flex flex-col items-center gap-2 justify-center p-4 w-[250px] relative"
            key={step.path}
          >
            <div className="w-full flex justify-center">
              <button
                className={cn(
                  'rounded-full',
                  isActive &&
                    'ring-1 ring-offset-2 ring-primary ring-offset-background',
                  'bg-black',
                  'text-white p-1'
                )}
                disabled={isDisabled}
                onClick={() => navigateTo(step)}
              >
                {isCurrent && <Circle />}
                {!isCurrent && (!isDisabled ? <Check /> : <Dot />)}
              </button>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold">{step.label}</span>
              <span className="text-muted-foreground text-sm truncate">
                {step?.description}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
