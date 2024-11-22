import { ReactNode } from 'react';
import Header from '../../../api/auth/[...nextauth]/Header';
import { StepperProvider, Steps } from '../../useStepper';
import Stepper from '../../../components/Stepper';

const resumeSteps = (resumeId: string): Steps => {
  return [
    {
      label: 'Job Advertisement',
      path: `/resume/${resumeId}/job-advertisement`,
      description: 'Enter the job advertisement for your resume.',
    },
    {
      label: 'Personal Information',
      path: `/resume/${resumeId}/personal-information`,
      description: 'Enter your personal information.',
    },
    {
      label: 'Skills',
      path: `/resume/${resumeId}/skills`,
      description: 'Enter your skills.',
    },
    {
      label: 'Work Experience',
      path: `/resume/${resumeId}/work-experience`,
      description: 'Enter your work experience.',
    },
    {
      label: 'Education',
      path: `/resume/${resumeId}/education`,
      description: 'Enter your education.',
    },
    {
      label: 'Summary',
      path: `/resume/${resumeId}/summary`,
      description: 'A summary of your resume.',
    },
    {
      label: 'Download Resume',
      path: `/resume/${resumeId}/download-resume`,
      description: 'Download your resume.',
    },
  ];
};

export default function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: any;
}) {
  const steps = resumeSteps(params.resumeId);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <StepperProvider steps={steps}>
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
