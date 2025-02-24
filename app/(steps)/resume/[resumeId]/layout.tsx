import { ReactNode } from 'react';
import { StepperProvider, Steps } from '../../useStepper';
import Stepper from '../../../components/Stepper';
import supabaseClient from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ProtectedPaidLayout from '@/app/components/ProtectedPaidLayout';
import { auth } from '@/auth';

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

export default async function DashboardLayout(props: {
  children: ReactNode;
  params: Promise<any>;
}) {
  const params = await props.params;

  const { children } = props;

  const supabase = supabaseClient();
  const session = await auth();

  const { data: resume, error } = await supabase
    .from('resume')
    .select()
    .eq('id', params.resumeId)
    .eq('user_id', session?.user?.id)
    .single();

  if (resume == null || error) {
    notFound();
  }

  const steps = resumeSteps(params.resumeId);

  return (
    <div className="min-h-screen flex flex-col">
      <StepperProvider steps={steps}>
        <main className="mx-auto max-w-screen-2xl w-full p-4 flex-1 overflow-y-auto">
          <div>
            <Stepper disableAllButLast={!!resume.payment_successful} />
          </div>
          <div className="mt-4 pb-16">
            <ProtectedPaidLayout resume={resume}>
              {children}
            </ProtectedPaidLayout>
          </div>
        </main>
      </StepperProvider>
    </div>
  );
}
