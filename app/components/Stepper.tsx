'use client';
import React, { FunctionComponent, useMemo } from 'react';
import { useStepper } from '../(dashboard)/useStepper';
import { usePathname } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, Circle, Dot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepperProps {}

const Stepper: FunctionComponent<StepperProps> = () => {
  const { steps, comesAfterCurrentStep, navigateTo } = useStepper();
  const currentPath = usePathname();

  const visibleSteps = useMemo(() => {
    const currentStepIndex = steps.findIndex((s) => s.path === currentPath);
    const start = Math.max(0, currentStepIndex - 2);
    const end = Math.min(steps.length, currentStepIndex + 3);
    const slice = steps.slice(start, end);

    if (slice.length < 5) {
      if (start === 0) {
        return steps.slice(0, 5);
      } else {
        return steps.slice(-5);
      }
    }

    return slice;
  }, [steps, currentPath]);

  return (
    <div className="flex gap-4 justify-center items-center">
      {visibleSteps[0].path !== steps[0].path && (
        <div className="text-muted-foreground flex items-center gap-1">
          <ArrowLeft />
          more
        </div>
      )}
      {visibleSteps.map((step) => {
        const isDisabled = comesAfterCurrentStep(step);
        const isActive = currentPath === step.path;
        const isCurrent = currentPath === step.path;
        const isLast =
          steps.length - 1 === steps.findIndex((s) => s.path === step.path);

        return (
          <div
            className="flex flex-col items-center gap-2 py-4 w-[250px]"
            key={step.path}
          >
            <div className="w-full flex justify-center">
              <button
                className={cn(
                  'rounded-full',
                  isActive &&
                    'ring-1 ring-offset-2 ring-primary ring-offset-background',
                  'bg-black',
                  'text-white p-1',
                  isDisabled && 'opacity-30'
                )}
                disabled={isDisabled}
                onClick={() => navigateTo(step)}
              >
                {isCurrent && <>{isLast ? <Check /> : <Circle />}</>}
                {!isCurrent && (!isDisabled ? <Check /> : <Dot />)}
              </button>
            </div>
            <div
              className={cn(
                'flex flex-col items-center w-full',
                isDisabled && 'text-muted-foreground'
              )}
            >
              <div className="font-bold text-center w-full">
                <span className="block truncate">{step.label}</span>
              </div>
              <div className="text-muted-foreground text-sm w-full text-center flex-grow">
                <span className="block truncate">{step?.description}</span>
              </div>
            </div>
          </div>
        );
      })}
      {visibleSteps.length < steps.length - 1 &&
        visibleSteps[visibleSteps.length - 1].path !==
          steps[steps.length - 1].path && (
          <div className="text-muted-foreground flex items-center gap-1">
            more
            <ArrowRight />
          </div>
        )}
    </div>
  );
};

export default Stepper;
