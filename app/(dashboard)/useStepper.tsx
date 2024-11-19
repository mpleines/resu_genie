'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

export type Step = {
  path: string;
  label?: string;
};

export type Steps = Array<Step>;

type StepperContextType = {
  steps: Steps;
  currentStep: Step | null;
  next: () => void;
  previous: () => void;
  setCurrentStep: (step: Step) => void;
  comesAfterCurrentStep: (step: Step) => boolean;
  navigateTo: (step: Step) => void;
};

const StepperContext = createContext<StepperContextType | undefined>(undefined);

type StepperProviderProps = {
  steps: Steps;
  children: ReactNode;
};

const StepperProvider = ({ steps, children }: StepperProviderProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const [currentStep, setCurrentStep] = useState<Step | null>(null);

  const getCurrentStep = () => {
    const step = steps.find((step) => step.path === pathname);
    if (step != null) {
      return step;
    } else {
      steps[0];
    }
  };

  useEffect(() => {
    const step = getCurrentStep();
    setCurrentStep(step!);
  }, []);

  const next = () => {
    const nextStepIndex =
      steps.findIndex((step) => step.path === currentStep?.path) + 1;
    if (nextStepIndex >= steps.length) {
      return;
    }
    const nextStep = steps[nextStepIndex];
    setCurrentStep(nextStep);
    router.push(nextStep.path);
  };

  const previous = () => {
    const previousStepIndex =
      steps.findIndex((step) => step.path === currentStep?.path) - 1;
    if (previousStepIndex < 0) {
      return;
    }
    const previousStep = steps[previousStepIndex];
    setCurrentStep(previousStep);
    router.push(previousStep.path);
  };

  const navigateTo = (step: Step) => {
    const stepIndex = steps.findIndex((s) => s.path === step.path);
    const nextStep = steps[stepIndex];
    setCurrentStep(nextStep);
    router.push(nextStep.path);
  };

  const comesAfterCurrentStep = (step: Step) => {
    const currentIndex = steps.findIndex((s) => s.path === currentStep?.path);
    const stepIndex = steps.findIndex((s) => s.path === step.path);
    return stepIndex > currentIndex;
  };

  return (
    <StepperContext.Provider
      value={{
        steps,
        currentStep,
        next,
        previous,
        setCurrentStep,
        comesAfterCurrentStep,
        navigateTo,
      }}
    >
      {children}
    </StepperContext.Provider>
  );
};

const useStepper = () => {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error('useSteps must be used within a StepperProvider');
  }
  return context;
};

export { StepperProvider, useStepper };
