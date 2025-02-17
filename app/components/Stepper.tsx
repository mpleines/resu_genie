'use client';
import React, { FunctionComponent, useMemo } from 'react';
import { Step, useStepper } from '../(steps)/useStepper';
import { usePathname } from 'next/navigation';
import { Check, Circle, Dot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsSmallScreen } from '@/hooks/useIsSmallScreen';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface StepperProps {}

const Stepper: FunctionComponent<StepperProps> = () => {
  const { steps, comesAfterCurrentStep } = useStepper();
  const currentPath = usePathname();
  const isSmallScreen = useIsSmallScreen();

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

  if (isSmallScreen) {
    return (
      <div className="font-bold">
        Step {steps.findIndex((s) => s.path === currentPath) + 1} of{' '}
        {steps.length}
      </div>
    );
  }

  return (
    <div className="flex gap-4 justify-center items-center overflow-hidden">
      {steps.map((step) => {
        return (
          <StepComponent
            key={step.path}
            step={step}
            isDisabled={comesAfterCurrentStep(step)}
            isActive={currentPath === step.path}
            isLast={
              steps.length - 1 === steps.findIndex((s) => s.path === step.path)
            }
            isLastVisible={
              visibleSteps.length - 1 ===
              visibleSteps.findIndex((s) => s.path === step.path)
            }
            isFinished={
              steps.findIndex((s) => s.path === step.path) <
              steps.findIndex((s) => s.path === currentPath)
            }
          />
        );
      })}
    </div>
  );
};

interface StepProps {
  step: Step;
  isDisabled?: boolean;
  isActive?: boolean;
  isFinished?: boolean;
  isLast?: boolean;
  isLastVisible?: boolean;
}

const StepComponent: FunctionComponent<StepProps> = ({
  step,
  isDisabled,
  isActive,
  isLast,
  isFinished,
}) => {
  const { navigateTo } = useStepper();

  function renderStatusIcon() {
    if (isActive && isLast) {
      return <Check />;
    }

    if (isFinished) {
      return <Check />;
    }

    if (isActive) {
      return <Circle />;
    }

    return <Dot />;
  }

  return (
    <div className="flex flex-col items-center gap-2 py-4 w-[250px]">
      <div className="w-full flex justify-center relative">
        <button
          className={cn(
            'rounded-full',
            isActive &&
              'ring-1 ring-offset-2 ring-primary ring-offset-background',
            'bg-primary',
            'text-white p-1',
            isDisabled && 'opacity-30'
          )}
          disabled={isDisabled}
          onClick={() => navigateTo(step)}
        >
          {renderStatusIcon()}
        </button>

        {!isLast && (
          <div className="h-0.5 top-[50%] w-[calc(100%_-_20px)] left-[50%] translate-x-[20px] absolute bg-gray-200"></div>
        )}
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
};
export default Stepper;
