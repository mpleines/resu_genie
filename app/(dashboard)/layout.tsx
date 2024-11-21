import { ReactNode } from 'react';
import Header from '../api/auth/[...nextauth]/Header';
import { StepperProvider, Steps } from './useStepper';
import Stepper from '../components/Stepper';

const resumeSteps: Steps = [
  {
    label: 'Job Advertisement',
    path: '/job-advertisement',
    description: 'Enter the job advertisement for your resume.',
  },
  {
    label: 'Personal Information',
    path: '/personal-information',
    description: 'Enter your personal information.',
  },
  {
    label: 'Skills',
    path: '/skills',
    description: 'Enter your skills.',
  },
  {
    label: 'Work Experience',
    path: '/work-experience',
    description: 'Enter your work experience.',
  },
  {
    label: 'Education',
    path: '/education',
    description: 'Enter your education.',
  },
  {
    label: 'Summary',
    path: '/summary',
    description: 'A summary of your resume.',
  },
  {
    label: 'Download Resume',
    path: '/download-resume',
    description: 'Download your resume.',
  },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <StepperProvider steps={resumeSteps}>
        <main className="mx-auto max-w-screen-2xl w-full py-16 px-16 flex-1 overflow-y-auto">
          <div>
            <Stepper />
          </div>
          <div className="mt-4">{children}</div>
        </main>
      </StepperProvider>
    </div>
  );
}
