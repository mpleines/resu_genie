import { ReactNode } from 'react';
import Header from '../api/auth/[...nextauth]/Header';
import { StepperProvider, Steps } from './useStepper';
import Stepper from '../components/Stepper';

const resumeSteps: Steps = [
  {
    label: 'Job Advertisement',
    path: '/job-advertisement',
  },
  {
    label: 'Personal Information',
    path: '/personal-information',
  },
  {
    label: 'Skills',
    path: '/skills',
  },
  {
    label: 'Work Experience',
    path: '/work-experience',
  },
  {
    label: 'Education',
    path: '/education',
  },
  {
    label: 'Summary',
    path: '/summary',
  },
  {
    label: 'Download Resume',
    path: '/download-resume',
  },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <StepperProvider steps={resumeSteps}>
        <main className="py-16 px-16 flex-1 overflow-y-auto">
          <div>
            <Stepper />
          </div>
          {children}
        </main>
      </StepperProvider>
    </div>
  );
}
